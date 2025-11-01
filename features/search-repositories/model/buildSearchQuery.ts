import { SearchFormData } from "./searchSchema";

export function buildSearchQuery(data: SearchFormData): string {
  const parts = [data.keyword];

  // Star
  if (data.star.min !== null && data.star.min !== undefined && !isNaN(Number(data.star.min))) {
    parts.push(`stars:>=${data.star.min}`);
  }
  if (data.star.max !== null && data.star.max !== undefined && !isNaN(Number(data.star.max))) {
    parts.push(`stars:<=${data.star.max}`);
  }

  // Fork
  if (data.fork.min !== null && data.fork.min !== undefined && !isNaN(Number(data.fork.min))) {
    parts.push(`forks:>=${data.fork.min}`);
  }
  if (data.fork.max !== null && data.fork.max !== undefined && !isNaN(Number(data.fork.max))) {
    parts.push(`forks:<=${data.fork.max}`);
  }

  return parts.filter(Boolean).join(" ");
}
