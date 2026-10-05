import { formatPKR } from "./money";

export { formatPKR };

export function formatDate(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d);
}
