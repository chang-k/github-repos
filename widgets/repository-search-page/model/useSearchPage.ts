"use client";

import { useState } from "react";
import { SearchFormData } from "@/features/search-repositories";

export const useSearchPage = () => {
  const [filters, setFilters] = useState<SearchFormData | null>(null);

  const handleSearch = (formData: SearchFormData) => {
    setFilters(formData);
  };

  return {
    filters,
    handleSearch,
  };
};
