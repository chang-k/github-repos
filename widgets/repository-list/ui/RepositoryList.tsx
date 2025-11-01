"use client";

import React from "react";
import { RepositoryCard } from "@/entities/repository";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { useInfiniteRepositories } from "../model/useInfiniteRepositories";

interface RepositoryListProps {
  searchQuery: string;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  searchQuery,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRepositories(searchQuery);

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
