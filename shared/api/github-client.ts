const GITHUB_API_BASE = "https://api.github.com";

export async function githubFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${GITHUB_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export { GITHUB_API_BASE };
