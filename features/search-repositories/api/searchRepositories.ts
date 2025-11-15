import type { SearchRepositoriesResponse } from "@/entities/repository";
import { githubFetch } from "@/shared/api/github-client";

interface SearchParams {
  q: string;
  per_page?: number;
  page?: number;
}

export async function searchRepositories(
  params: SearchParams
): Promise<SearchRepositoriesResponse> {
  const queryParts: string[] = [];

  if (params.q) {
    queryParts.push(`q=${params.q}`);
  }
  if (params.per_page) {
    queryParts.push(`per_page=${params.per_page}`);
  }
  if (params.page) {
    queryParts.push(`page=${params.page}`);
  }

  const queryString = queryParts.join("&");

  return githubFetch<SearchRepositoriesResponse>(
    `/search/repositories?${queryString}`,
    {
      next: { revalidate: 60 },
    }
  );
}
