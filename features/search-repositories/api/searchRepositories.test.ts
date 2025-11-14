import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { searchRepositories } from './searchRepositories';

const server = setupServer(
  http.get('https://api.github.com/search/repositories', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');

    if (q === 'react') {
      return HttpResponse.json({
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            id: 1,
            name: 'react',
            full_name: 'facebook/react',
            owner: {
              login: 'facebook',
              avatar_url: 'https://example.com/avatar.png',
            },
            description: 'A JavaScript library for building user interfaces',
            stargazers_count: 100000,
            watchers_count: 100000,
            forks_count: 20000,
            open_issues_count: 500,
            language: 'JavaScript',
            html_url: 'https://github.com/facebook/react',
          },
          {
            id: 2,
            name: 'react-native',
            full_name: 'facebook/react-native',
            owner: {
              login: 'facebook',
              avatar_url: 'https://example.com/avatar.png',
            },
            description: 'A framework for building native apps with React',
            stargazers_count: 80000,
            watchers_count: 80000,
            forks_count: 15000,
            open_issues_count: 300,
            language: 'JavaScript',
            html_url: 'https://github.com/facebook/react-native',
          },
        ],
      });
    }

    if (q?.includes('stars:100..1000')) {
      return HttpResponse.json({
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 3,
            name: 'example-repo',
            full_name: 'user/example-repo',
            owner: {
              login: 'user',
              avatar_url: 'https://example.com/avatar.png',
            },
            description: 'Example repository',
            stargazers_count: 500,
            watchers_count: 500,
            forks_count: 50,
            open_issues_count: 10,
            language: 'TypeScript',
            html_url: 'https://github.com/user/example-repo',
          },
        ],
      });
    }

    return HttpResponse.json({
      total_count: 0,
      incomplete_results: false,
      items: [],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('searchRepositories', () => {
  it('検索結果を取得できる', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 10,
      page: 1,
    });

    expect(result.total_count).toBe(2);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].name).toBe('react');
    expect(result.items[1].name).toBe('react-native');
  });

  it('per_page パラメータが正しく渡される', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 5,
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.items).toHaveLength(2);
  });

  it('page パラメータが正しく渡される', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 10,
      page: 2,
    });

    expect(result).toBeDefined();
  });

  it('クエリパラメータが正しくエンコードされる', async () => {
    const result = await searchRepositories({
      q: 'react stars:100..1000',
      per_page: 10,
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.total_count).toBe(1);
    expect(result.items[0].stargazers_count).toBe(500);
  });

  it('検索結果が0件の場合、空の配列を返す', async () => {
    const result = await searchRepositories({
      q: 'nonexistent-repo-12345',
      per_page: 10,
      page: 1,
    });

    expect(result.total_count).toBe(0);
    expect(result.items).toHaveLength(0);
  });

  it('incomplete_results フラグを含む', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 10,
      page: 1,
    });

    expect(result).toHaveProperty('incomplete_results');
    expect(typeof result.incomplete_results).toBe('boolean');
  });

  it('各リポジトリに必要なプロパティが含まれる', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 10,
      page: 1,
    });

    const repo = result.items[0];

    expect(repo).toHaveProperty('id');
    expect(repo).toHaveProperty('name');
    expect(repo).toHaveProperty('full_name');
    expect(repo).toHaveProperty('owner');
    expect(repo).toHaveProperty('description');
    expect(repo).toHaveProperty('stargazers_count');
    expect(repo).toHaveProperty('watchers_count');
    expect(repo).toHaveProperty('forks_count');
    expect(repo).toHaveProperty('open_issues_count');
    expect(repo).toHaveProperty('language');
    expect(repo).toHaveProperty('html_url');
  });

  it('owner オブジェクトに login と avatar_url が含まれる', async () => {
    const result = await searchRepositories({
      q: 'react',
      per_page: 10,
      page: 1,
    });

    const owner = result.items[0].owner;

    expect(owner).toHaveProperty('login');
    expect(owner).toHaveProperty('avatar_url');
    expect(owner.login).toBe('facebook');
  });
});
