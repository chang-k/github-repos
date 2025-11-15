"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toRepositoryItem } from "@/entities/repository";
import {
  searchRepositories,
  buildSearchQuery,
  SearchFormData,
} from "@/features/search-repositories";

export const useInfiniteRepositories = (filters: SearchFormData | null) => {
  const searchQuery = useMemo(() => {
    if (!filters) return "";
    return buildSearchQuery(filters);
  }, [filters]);

  return useInfiniteQuery({
    queryKey: ["repositories", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      if (!searchQuery) {
        return { items: [], totalCount: 0, incompleteResults: false };
      }
      const response = await searchRepositories({
        q: searchQuery,
        per_page: 10,
        page: pageParam,
      });

      // APIレスポンスをフロントエンド用の型に変換
      return {
        totalCount: response.total_count,
        incompleteResults: response.incomplete_results,
        items: response.items.map(toRepositoryItem),
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0
      );
      if (totalFetched < lastPage.totalCount) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!searchQuery,
    initialPageParam: 1,
  });
};
