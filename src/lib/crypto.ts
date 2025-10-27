import argon2 from 'argon2-browser';
const KEY_LENGTH = 32; // AES-256
const SALT_LENGTH = 16;
const IV_LENGTH = 12; // Recommended for AES-GCM
const ARGON_SALT_LENGTH = 16;
const ARGON_TIME_COST = 4;
const ARGON_MEMORY_COST = 65536; // 64MB
const ARGON_PARALLELISM = 1;
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const passwordEncoded = new TextEncoder().encode(passphrase);
  const argonResult = await argon2.hash({
    pass: passwordEncoded,
    salt: salt,
    time: ARGON_TIME_COST,
    mem: ARGON_MEMORY_COST,
    parallelism: ARGON_PARALLELISM,
    hashLen: KEY_LENGTH,
    type: argon2.ArgonType.Argon2id,
  });
  const keyData = argonResult.hash.slice(0, KEY_LENGTH);
  return crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}
export async function encryptFile(file: File, passphrase: string, onProgress: (p: number) => void): Promise<Blob> {
  onProgress(0);
  const fileBuffer = await file.arrayBuffer();
  onProgress(10);
  const argonSalt = crypto.getRandomValues(new Uint8Array(ARGON_SALT_LENGTH));
  const key = await deriveKey(passphrase, argonSalt);
  onProgress(40);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    fileBuffer
  );
  onProgress(90);
  // Prepend argonSalt and IV to the encrypted data
  const resultBuffer = new Uint8Array(argonSalt.length + iv.length + encryptedContent.byteLength);
  resultBuffer.set(argonSalt, 0);
  resultBuffer.set(iv, argonSalt.length);
  resultBuffer.set(new Uint8Array(encryptedContent), argonSalt.length + iv.length);
  onProgress(100);
  return new Blob([resultBuffer]);
}
export async function decryptFile(file: File, passphrase: string, onProgress: (p: number) => void): Promise<Blob> {
  onProgress(0);
  const fileBuffer = await file.arrayBuffer();
  onProgress(10);
  const fileBytes = new Uint8Array(fileBuffer);
  const argonSalt = fileBytes.slice(0, ARGON_SALT_LENGTH);
  const iv = fileBytes.slice(ARGON_SALT_LENGTH, ARGON_SALT_LENGTH + IV_LENGTH);
  const encryptedContent = fileBytes.slice(ARGON_SALT_LENGTH + IV_LENGTH);
  const key = await deriveKey(passphrase, argonSalt);
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