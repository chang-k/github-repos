"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchFormData } from "./searchSchema";

export const useSearchForm = (onSearch: (query: string) => void) => {
  const { register, handleSubmit, formState } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: "",
      star: { min: null, max: null },
      watcher: { min: null, max: null },
      fork: { min: null, max: null },
      issue: { min: null, max: null },
    },
  });

  return {
    register,
    handleSubmit,
    errors: formState.errors,
    onSearch,
  };
};
