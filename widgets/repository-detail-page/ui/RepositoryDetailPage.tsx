import Link from "next/link";
import React from "react";
import { RepositoryDetail } from "@/entities/repository";
import { RepositoryHeader, RepositoryStats } from "@/entities/repository";
import { Button } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Heading";
import { Icon } from "@/shared/ui/Icon";
import { Text } from "@/shared/ui/Text";

interface RepositoryDetailPageProps {
  repository: RepositoryDetail;
}

export const RepositoryDetailPage: React.FC<RepositoryDetailPageProps> = ({
  repository,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Link href="/">
            <Button
              variant="secondary"
              className="mb-6 flex items-center gap-2"
            >
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
            stars={repository.stargazersCount}
            watchers={repository.watchersCount}
            forks={repository.forksCount}
            issues={repository.openIssuesCount}
          />

          <div>
            <Heading level={3} className="mb-3">
              説明
            </Heading>
            <Text className="text-gray-700">{repository.description}</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
