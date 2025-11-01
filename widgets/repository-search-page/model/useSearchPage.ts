"use client";

import { useState } from "react";

export const useSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    searchQuery,
    handleSearch,
  };
};
