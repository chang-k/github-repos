"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { searchRepositories, buildSearchQuery } from "@/lib/github-api";
import { SearchFilters } from "@/types/github";
import { RepositoryListPresenter } from "./RepositoryListPresenter";

interface SearchFormData {
  keyword: string;
  minStars?: number;
  maxStars?: number;
  minWatchers?: number;
  maxWatchers?: number;
  minForks?: number;
  maxForks?: number;
  minIssues?: number;
  maxIssues?: number;
}

export const RepositoryListContainer: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<SearchFormData>({
    defaultValues: {
      keyword: "",
    },
  });

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["repositories", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      if (!searchQuery) {
        return { items: [], total_count: 0, incomplete_results: false };
      }
      return searchRepositories({
        q: searchQuery,
        per_page: 10,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0
      );
      if (totalFetched < lastPage.total_count) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!searchQuery,
    initialPageParam: 1,
  });

  const { ref: observerRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const onSubmit = (formData: SearchFormData) => {
    const filters: SearchFilters = {
      minStars: formData.minStars,
      maxStars: formData.maxStars,
      minForks: formData.minForks,
      maxForks: formData.maxForks,
    };

    const query = buildSearchQuery(formData.keyword, filters);
    setSearchQuery(query);
  };

  const repositories = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <RepositoryListPresenter
      repositories={repositories}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      observerRef={observerRef}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage ?? false}
    />
  );
};
