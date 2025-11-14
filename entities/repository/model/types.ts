/**
 * リポジトリ詳細（フロントエンド用）
 */
export interface RepositoryDetail {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  watchersCount: number;
  forksCount: number;
  openIssuesCount: number;
  language: string | null;
}

/**
 * リポジトリ一覧アイテム（フロントエンド用）
 */
export interface RepositoryItem {
  id: number;
  name: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}
