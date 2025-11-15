import { SearchFormData } from "./searchSchema";

/**
 * GitHub検索APIのクエリパーツを構築（エンコード前）
 *
 * @param data - 検索フォームのデータ
 * @returns スペースで結合されたクエリ文字列（エンコード前）
 */
export const buildSearchParts = (data: SearchFormData): string => {
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

  return parts.join(" ");
};
