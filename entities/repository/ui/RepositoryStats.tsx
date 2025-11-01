import React from "react";
import { Text } from "@/shared/ui/Text";
import { formatNumber } from "../model/formatters";

interface RepositoryStatsProps {
  stars: number;
  watchers: number;
  forks: number;
  issues: number;
}

export const RepositoryStats: React.FC<RepositoryStatsProps> = ({
  stars,
  watchers,
  forks,
  issues,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <Text className="text-gray-600 mb-2">Star数</Text>
          <Text className="font-semibold text-lg">{formatNumber(stars)}</Text>
        </div>
        <div>
          <Text className="text-gray-600 mb-2">Watcher数</Text>
          <Text className="font-semibold text-lg">
            {formatNumber(watchers)}
          </Text>
        </div>
        <div>
          <Text className="text-gray-600 mb-2">Fork数</Text>
          <Text className="font-semibold text-lg">{formatNumber(forks)}</Text>
        </div>
        <div>
          <Text className="text-gray-600 mb-2">Issue数</Text>
          <Text className="font-semibold text-lg">{formatNumber(issues)}</Text>
        </div>
      </div>
    </div>
  );
};
