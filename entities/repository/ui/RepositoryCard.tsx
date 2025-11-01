import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Repository } from "../model/types";
import { Text } from "@/shared/ui/Text";

interface RepositoryCardProps {
  repository: Repository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
}) => {
  return (
    <Link
      href={`/detail/${repository.owner.login}/${repository.name}`}
      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Text className="font-semibold truncate">{repository.name}</Text>
        </div>
      </div>
    </Link>
  );
};
