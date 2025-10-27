const KEY_LENGTH = 32; // AES-256
const IV_LENGTH = 12; // Recommended for AES-GCM
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordEncoded = new TextEncoder().encode(passphrase);
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordEncoded,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}
export async function encryptFile(file: File, passphrase: string, onProgress: (p: number) => void): Promise<Blob> {
  onProgress(0);
  const fileBuffer = await file.arrayBuffer();
  onProgress(10);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(passphrase, salt);
  onProgress(40);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );
  onProgress(90);
  // Prepend salt and IV to the encrypted data
  const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
  resultBuffer.set(salt, 0);
  resultBuffer.set(iv, salt.length);
  resultBuffer.set(new Uint8Array(encryptedContent), salt.length + iv.length);
  onProgress(100);
  return new Blob([resultBuffer]);
}
export async function decryptFile(file: File, passphrase: string, onProgress: (p: number) => void): Promise<Blob> {
  onProgress(0);
  const fileBuffer = await file.arrayBuffer();
  onProgress(10);
  const fileBytes = new Uint8Array(fileBuffer);
  const salt = fileBytes.slice(0, SALT_LENGTH);
  const iv = fileBytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encryptedContent = fileBytes.slice(SALT_LENGTH + IV_LENGTH);
  const key = await deriveKey(passphrase, salt);
  onProgress(40);
  const decryptedContent = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedContent
  );
  onProgress(90);
  const originalFileType = await getFileType(new Uint8Array(decryptedContent));
  onProgress(100);
  return new Blob([decryptedContent], { type: originalFileType });
}
// A simple file type sniffer based on magic numbers
async function getFileType(data: Uint8Array): Promise<string> {
  const signatures: { [key: string]: string } = {
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    'FFD8FFDB': 'image/jpeg',
    'FFD8FFE0': 'image/jpeg',
    '25504446': 'application/pdf',
    '504B0304': 'application/zip',
  };
  const hex = Array.from(data.slice(0, 4)).map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  for (const sig in signatures) {
    if (hex.startsWith(sig)) {
      return signatures[sig];
    }
  }
  return 'application/octet-stream'; // Default fallback
}