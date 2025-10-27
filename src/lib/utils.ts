import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export type PassphraseStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Too Short' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
};
export function checkPassphraseStrength(passphrase: string): PassphraseStrength {
  let score = 0;
  if (passphrase.length < 8) {
    return { score: 0, label: 'Too Short' };
  }
  // Award points for different character types
  if (passphrase.length >= 8) score++;
  if (passphrase.length >= 12) score++;
  if (/[A-Z]/.test(passphrase) && /[a-z]/.test(passphrase)) score++;
  if (/\d/.test(passphrase)) score++;
  if (/[^A-Za-z0-9]/.test(passphrase)) score++; // Symbols
  // Clamp score to max 4
  const finalScore = Math.min(score, 4) as PassphraseStrength['score'];
  switch (finalScore) {
    case 0:
      return { score: 0, label: 'Too Short' };
    case 1:
      return { score: 1, label: 'Weak' };
    case 2:
      return { score: 2, label: 'Medium' };
    case 3:
      return { score: 3, label: 'Strong' };
    case 4:
      return { score: 4, label: 'Very Strong' };
    default:
      return { score: 0, label: 'Too Short' };
  }
}