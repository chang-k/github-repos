import { githubFetch } from "@/shared/api/github-client";
import { Repository } from "../model/types";

export async function getRepository(
  owner: string,
  repo: string
): Promise<Repository> {
  return githubFetch<Repository>(`/repos/${owner}/${repo}`, {
    next: { revalidate: 60 },
  });
}
