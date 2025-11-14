import React from "react";
import Image from "next/image";
import { Heading } from "@/shared/ui/Heading";
import { Text } from "@/shared/ui/Text";

interface RepositoryHeaderProps {
  name: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  language: string | null;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  name,
  owner,
  language,
}) => {
  return (
    <div className="flex items-start gap-4">
      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={owner.avatarUrl}
          alt={owner.login}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <Heading level={2} className="mb-2">
          {name}
        </Heading>
        <Text className="text-gray-600 mb-1">{owner.login}</Text>
        <Text className="text-gray-600">{language}</Text>
      </div>
    </div>
  );
};
