import type { RepositoryDetail, RepositoryItem } from './types';
import type { RepositoryDetailResponse, RepositoryItemResponse } from './api-types';

/**
 * RepositoryDetailResponseをRepositoryDetailに変換
 */
export function toRepositoryDetail(
  res: RepositoryDetailResponse
): RepositoryDetail {
  return {
    id: res.id,
    name: res.name,
    fullName: res.full_name,
    owner: {
      login: res.owner.login,
      avatarUrl: res.owner.avatar_url,
    },
    description: res.description,
    htmlUrl: res.html_url,
    stargazersCount: res.stargazers_count,
    watchersCount: res.watchers_count,
    forksCount: res.forks_count,
    openIssuesCount: res.open_issues_count,
    language: res.language,
  };
}

/**
 * RepositoryItemResponseをRepositoryItemに変換
 */
export function toRepositoryItem(
  res: RepositoryItemResponse
): RepositoryItem {
  return {
    id: res.id,
    name: res.name,
    owner: {
      login: res.owner.login,
      avatarUrl: res.owner.avatar_url,
    },
  };
}
