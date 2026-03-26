import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatSalary(salary?: { min: number; max: number; currency: string }): string {
  if (!salary) return "Not specified";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: salary.currency || "USD",
    maximumFractionDigits: 0,
  });
  return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return "text-accent-emerald";
  if (score >= 60) return "text-accent-amber";
  return "text-accent-rose";
}

export function getMatchScoreBg(score: number): string {
  if (score >= 80) return "bg-accent-emerald";
  if (score >= 60) return "bg-accent-amber";
  return "bg-accent-rose";
}

export function getStatusColor(status: string): { bg: string; text: string; dot: string } {
  switch (status) {
    case "saved":
      return { bg: "bg-accent-cyan/20", text: "text-accent-cyan", dot: "bg-accent-cyan" };
    case "applied":
      return { bg: "bg-accent-violet/20", text: "text-accent-violet", dot: "bg-accent-violet" };
    case "pending":
      return { bg: "bg-accent-amber/20", text: "text-accent-amber", dot: "bg-accent-amber" };
    case "interview":
      return { bg: "bg-accent-emerald/20", text: "text-accent-emerald", dot: "bg-accent-emerald" };
    case "rejected":
      return { bg: "bg-accent-rose/20", text: "text-accent-rose", dot: "bg-accent-rose" };
    default:
      return { bg: "bg-text-muted/20", text: "text-text-muted", dot: "bg-text-muted" };
  }
}

export function getSourceIcon(source: string): string {
  switch (source) {
    case "linkedin":
      return "LinkedIn";
    case "indeed":
      return "Indeed";
    case "jobstreet":
      return "JobStreet";
    default:
      return "Briefcase";
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
