import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday as dateFnsIsToday, isSameDay as dateFnsIsSameDay, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(username: string): string {
  if (!username) return "";
  const parts = username.split(/[\s_.-]+/);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
}

export function formatTime(isoString: string): string {
  if (!isoString) return "";
  return format(new Date(isoString), "h:mm a");
}

export function formatDate(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (dateFnsIsToday(date)) return "Today";
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateFnsIsSameDay(date, yesterday)) return "Yesterday";
  
  return format(date, "MMM d, yyyy");
}

export function formatLastSeen(isoString: string): string {
  if (!isoString) return "";
  return `Last seen ${formatDistanceToNow(new Date(isoString), { addSuffix: true })}`;
}

export function isToday(isoString: string): boolean {
  if (!isoString) return false;
  return dateFnsIsToday(new Date(isoString));
}

export function isSameDay(a: string, b: string): boolean {
  if (!a || !b) return false;
  return dateFnsIsSameDay(new Date(a), new Date(b));
}

export function truncate(str: string, maxLen: number): string {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return `${str.substring(0, maxLen)}...`;
}
