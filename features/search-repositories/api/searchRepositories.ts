import { githubFetch } from "@/shared/api/github-client";
import { SearchRepositoriesResponse } from "@/entities/repository";

interface SearchParams {
  q: string;
  per_page?: number;
  page?: number;
}

export async function searchRepositories(
  params: SearchParams
): Promise<SearchRepositoriesResponse> {
  const queryParams = new URLSearchParams();

  if (params.q) queryParams.append("q", params.q);
  if (params.per_page)
    queryParams.append("per_page", params.per_page.toString());
  if (params.page) queryParams.append("page", params.page.toString());

  return githubFetch<SearchRepositoriesResponse>(
    `/search/repositories?${queryParams.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );
}
