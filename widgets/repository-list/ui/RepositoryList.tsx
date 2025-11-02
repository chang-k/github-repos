"use client";

import React from "react";
import { RepositoryCard } from "@/entities/repository";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { useInfiniteRepositories } from "../model/useInfiniteRepositories";
import { SearchFormData } from "@/features/search-repositories";

interface RepositoryListProps {
  filters: SearchFormData | null;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ filters }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRepositories(filters);

  const repositories = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-4">
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}

      <InfiniteScrollTrigger
        onInView={fetchNextPage}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
