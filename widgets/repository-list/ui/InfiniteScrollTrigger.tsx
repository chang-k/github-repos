"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollTriggerProps {
  onInView: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  onInView,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        onInView();
      }
    },
  });

  if (!hasNextPage) return null;

  return (
    <div ref={ref} className="py-8 text-center">
      {isFetchingNextPage ? (
        <p className="text-gray-600">読み込み中...</p>
      ) : (
        <p className="text-gray-400">スクロールして続きを読み込む</p>
      )}
    </div>
  );
};
