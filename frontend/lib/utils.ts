import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePortfolioId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function validateUrl(url: string, type: 'linkedin' | 'github'): boolean {
  try {
    const urlObj = new URL(url);
    if (type === 'linkedin') {
      return urlObj.hostname.includes('linkedin.com') && urlObj.pathname.includes('/in/');
    }
    if (type === 'github') {
      return urlObj.hostname === 'github.com' && urlObj.pathname.split('/').length >= 2;
    }
    return false;
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}