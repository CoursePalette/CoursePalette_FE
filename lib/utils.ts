import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(text: string) {
  if (text.length > 12) {
    return text.substring(0, 12) + '...';
  }
  return text;
}
