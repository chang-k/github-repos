import { SearchFormData } from "./searchSchema";
import { buildSearchParts } from "./buildSearchParts";

/**
 * GitHub検索APIのクエリ文字列を構築（URLエンコード済み）
 *
 * @param data - 検索フォームのデータ
 * @returns URLエンコードされたクエリ文字列
 */
export const buildSearchQuery = (data: SearchFormData): string => {
  return encodeURIComponent(buildSearchParts(data));
}
