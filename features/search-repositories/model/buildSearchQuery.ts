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
export const buildSearchQuery = (data: SearchFormData): string => {
  const parts = [data.keyword];

  // Star
  if (data.star.min !== "" && data.star.max !== "") {
    parts.push(`stars:${data.star.min}..${data.star.max}`);
  } else if (data.star.min !== "") {
    parts.push(`stars:>=${data.star.min}`);
  } else if (data.star.max !== "") {
    parts.push(`stars:<=${data.star.max}`);
  }

  // Fork
  if (data.fork.min !== "" && data.fork.max !== "") {
    parts.push(`forks:${data.fork.min}..${data.fork.max}`);
  } else if (data.fork.min !== "") {
    parts.push(`forks:>=${data.fork.min}`);
  } else if (data.fork.max !== "") {
    parts.push(`forks:<=${data.fork.max}`);
  }

  // Size（KB単位)
  if (data.size.min !== "" && data.size.max !== "") {
    parts.push(`size:${data.size.min}..${data.size.max}`);
  } else if (data.size.min !== "") {
    parts.push(`size:>=${data.size.min}`);
  } else if (data.size.max !== "") {
    parts.push(`size:<=${data.size.max}`);
  }

  // Duration - Created
  if (data.duration.created !== "") {
    parts.push(`created:>=${data.duration.created}`);
  }

  // Duration - Pushed
  if (data.duration.pushed !== "") {
    parts.push(`pushed:<=${data.duration.pushed}`);
  }

  return encodeURIComponent(parts.join(" "));
}
