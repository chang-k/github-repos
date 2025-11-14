import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RepositoryItem } from "../model/types";
import { Text } from "@/shared/ui/Text";

interface RepositoryCardProps {
  repositoryItem: RepositoryItem;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repositoryItem,
}) => {
  return (
    <Link
      href={`/detail/${repositoryItem.owner.login}/${repositoryItem.name}`}
      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={repositoryItem.owner.avatarUrl}
            alt={repositoryItem.owner.login}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Text className="font-semibold truncate">{repositoryItem.name}</Text>
        </div>
      </div>
    </Link>
  );
};
