import { githubFetch } from "@/shared/api/github-client";
import type { RepositoryDetailResponse } from "../model/api-types";

/**
 * GitHub APIから単一リポジトリの詳細を取得（APIレスポンスをそのまま返す）
 */
export async function getRepository(
  owner: string,
  repo: string
): Promise<RepositoryDetailResponse> {
  return githubFetch<RepositoryDetailResponse>(`/repos/${owner}/${repo}`, {
    next: { revalidate: 60 },
  });
}
