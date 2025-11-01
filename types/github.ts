export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
}

export interface SearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export interface SearchParams {
  q: string;
  sort?: "stars" | "forks" | "updated";
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export interface SearchFilters {
  minStars?: number;
  maxStars?: number;
  minWatchers?: number;
  maxWatchers?: number;
  minForks?: number;
  maxForks?: number;
  minIssues?: number;
  maxIssues?: number;
}
