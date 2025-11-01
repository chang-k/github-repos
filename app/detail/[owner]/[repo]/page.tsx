import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getRepository } from "@/lib/github-api";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

interface DetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { owner, repo } = await params;
  const repository = await getRepository(owner, repo);

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
          {/* Repository Header */}
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <Heading level={2} className="mb-2">
                {repository.name}
              </Heading>
              <Text className="text-gray-600 mb-1">
                {repository.owner.login}
              </Text>
              {repository.language && (
                <Text className="text-gray-600">{repository.language}</Text>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <Text className="text-gray-600 mb-2">Star数</Text>
                <Text className="font-semibold text-lg">
                  {repository.stargazers_count.toLocaleString()}
                </Text>
              </div>
              <div>
                <Text className="text-gray-600 mb-2">Watcher数</Text>
                <Text className="font-semibold text-lg">
                  {repository.watchers_count.toLocaleString()}
                </Text>
              </div>
              <div>
                <Text className="text-gray-600 mb-2">Fork数</Text>
                <Text className="font-semibold text-lg">
                  {repository.forks_count.toLocaleString()}
                </Text>
              </div>
              <div>
                <Text className="text-gray-600 mb-2">Issue数</Text>
                <Text className="font-semibold text-lg">
                  {repository.open_issues_count.toLocaleString()}
                </Text>
              </div>
            </div>
          </div>

          {/* Description */}
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
}
