import React from "react";
import Link from "next/link";
import { Repository } from "@/entities/repository";
import { Heading } from "@/shared/ui/Heading";
import { Text } from "@/shared/ui/Text";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { RepositoryHeader, RepositoryStats } from "@/entities/repository";

interface RepositoryDetailPageProps {
  repository: Repository;
}

export const RepositoryDetailPage: React.FC<RepositoryDetailPageProps> = ({
  repository,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Link href="/">
            <Button variant="secondary" className="mb-6 flex items-center gap-2">
              <Icon type="arrow-left" />
              戻る
            </Button>
          </Link>

          <Heading level={1}>リポジトリ詳細</Heading>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <RepositoryHeader
            name={repository.name}
            owner={repository.owner}
            language={repository.language}
          />

          <RepositoryStats
            stars={repository.stargazers_count}
            watchers={repository.watchers_count}
            forks={repository.forks_count}
            issues={repository.open_issues_count}
          />

          {repository.description && (
            <div>
              <Heading level={3} className="mb-3">
                説明
              </Heading>
              <Text className="text-gray-700">{repository.description}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
