"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchRepositories, buildSearchQuery, SearchFormData } from "@/features/search-repositories";

export const useInfiniteRepositories = (filters: SearchFormData | null) => {
  const searchQuery = useMemo(() => {
    if (!filters) return "";
    return buildSearchQuery(filters);
  }, [filters]);

  return useInfiniteQuery({
    queryKey: ["repositories", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      if (!searchQuery) {
        return { items: [], total_count: 0, incomplete_results: false };
      }
      return searchRepositories({
        q: searchQuery,
        per_page: 10,
        page: pageParam,
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
};
