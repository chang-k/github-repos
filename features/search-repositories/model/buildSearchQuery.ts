import { SearchFormData } from "./searchSchema";

/**
 * GitHub検索APIのクエリ文字列を構築
 *
 * GitHub APIの検索でサポートされている条件:
 * - stars: Star数の範囲指定
 * - forks: Fork数の範囲指定
 * - size: リポジトリサイズ（KB単位）の範囲指定
 * - created: 作成日の範囲指定
 * - pushed: 最終更新日の範囲指定
 */
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

  // Size(KB単位)
  if (data.size.min !== null && data.size.min !== undefined && !isNaN(Number(data.size.min))) {
    parts.push(`size:>=${data.size.min}`);
  }
  if (data.size.max !== null && data.size.max !== undefined && !isNaN(Number(data.size.max))) {
    parts.push(`size:<=${data.size.max}`);
  }

  // Duration - Created
  if (data.duration.created) {
    parts.push(`created:>=${data.duration.created}`);
  }

  // Duration - Pushed
  if (data.duration.pushed) {
    parts.push(`pushed:<=${data.duration.pushed}`);
  }

  return parts.join("+");
}
