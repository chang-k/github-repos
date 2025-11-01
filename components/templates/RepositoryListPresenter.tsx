import React from "react";
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";
import { Repository } from "@/types/github";
import { Heading } from "@/components/atoms/Heading";
import { SearchForm } from "@/components/organisms/SearchForm";
import { RepositoryCard } from "@/components/organisms/RepositoryCard";

interface RepositoryListPresenterProps {
  repositories: Repository[];
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  observerRef: (node: HTMLDivElement | null) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

export const RepositoryListPresenter: React.FC<
  RepositoryListPresenterProps
> = ({
  repositories,
  register,
  handleSubmit,
  onSubmit,
  observerRef,
  isFetchingNextPage,
  hasNextPage,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Heading level={1} className="mb-6">
            リポジトリ検索
          </Heading>

          <SearchForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </div>

        <div className="space-y-4">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </div>

        {hasNextPage && (
          <div ref={observerRef} className="py-8 text-center">
            {isFetchingNextPage ? (
              <p className="text-gray-600">読み込み中...</p>
            ) : (
              <p className="text-gray-400">スクロールして続きを読み込む</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
