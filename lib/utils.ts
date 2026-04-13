import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}