"use client";

import React from "react";
import { Heading } from "@/shared/ui/Heading";
import { SearchForm } from "@/features/search-repositories";
import { RepositoryList } from "@/widgets/repository-list";
import { useSearchPage } from "../model/useSearchPage";

export const RepositorySearchPage: React.FC = () => {
  const { filters, handleSearch } = useSearchPage();

  return (
    // TODO: 以下全体的にMemo化。Jotaiでレンダリングの範囲を絞る。
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Heading level={1} className="mb-6">
            リポジトリ検索
          </Heading>

          <SearchForm onSearch={handleSearch} />
        </div>

        <RepositoryList filters={filters} />
      </div>
    </div>
  );
};
