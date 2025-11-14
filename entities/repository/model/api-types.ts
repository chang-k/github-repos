/**
 * リポジトリ詳細のAPIレスポンス型
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
 */
export interface RepositoryDetailResponse {
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
  // これ以上は長いため割愛
}

export interface RepositoryItemResponse {
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
  // これ以上は長いため割愛
}

/**
 * 検索APIのレスポンス型
 * @see https://docs.github.com/ja/rest/search/search?apiVersion=2022-11-28#search-repositories
 */
export interface SearchRepositoriesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: RepositoryItemResponse[];
}
