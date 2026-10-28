import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateSafe(dateStr?: string | null): string {
  if (!dateStr) return "2026-10-26";
  try {
    return dateStr.slice(0, 10);
  } catch {
    return dateStr;
  }
}
