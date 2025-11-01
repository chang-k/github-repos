export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatRepositoryName(fullName: string): {
  owner: string;
  repo: string;
} {
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
}
