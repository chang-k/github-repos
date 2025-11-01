import {
  Repository,
  SearchRepositoriesResponse,
  SearchParams,
  SearchFilters,
} from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

export async function searchRepositories(
  params: SearchParams
): Promise<SearchRepositoriesResponse> {
  const queryParams = new URLSearchParams();

  if (params.q) queryParams.append("q", params.q);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.order) queryParams.append("order", params.order);
  if (params.per_page) queryParams.append("per_page", params.per_page.toString());
  if (params.page) queryParams.append("page", params.page.toString());

  const url = `${GITHUB_API_BASE}/search/repositories?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getRepository(
  owner: string,
  repo: string
): Promise<Repository> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export function buildSearchQuery(
  keyword: string,
  filters: SearchFilters
): string {
  const parts = [keyword];

  const minStars = Number(filters.minStars);
  const maxStars = Number(filters.maxStars);
  const minForks = Number(filters.minForks);
  const maxForks = Number(filters.maxForks);

  if (filters.minStars && !isNaN(minStars)) {
    parts.push(`stars:>=${minStars}`);
  }
  if (filters.maxStars && !isNaN(maxStars)) {
    parts.push(`stars:<=${maxStars}`);
  }
  if (filters.minForks && !isNaN(minForks)) {
    parts.push(`forks:>=${minForks}`);
  }
  if (filters.maxForks && !isNaN(maxForks)) {
    parts.push(`forks:<=${maxForks}`);
  }

  return parts.filter(Boolean).join(" ");
}
