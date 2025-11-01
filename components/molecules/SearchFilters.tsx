"use client";

import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/atoms/Input";

interface SearchFiltersProps {
  register: UseFormRegister<any>;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ register }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="最小Star数"
        type="number"
        placeholder="0"
        {...register("minStars")}
      />
      <Input
        label="最大Star数"
        type="number"
        placeholder="0"
        {...register("maxStars")}
      />
      <Input
        label="最小Watcher数"
        type="number"
        placeholder="0"
        {...register("minWatchers")}
      />
      <Input
        label="最大Watcher数"
        type="number"
        placeholder="0"
        {...register("maxWatchers")}
      />
      <Input
        label="最小Fork数"
        type="number"
        placeholder="0"
        {...register("minForks")}
      />
      <Input
        label="最大Fork数"
        type="number"
        placeholder="0"
        {...register("maxForks")}
      />
      <Input
        label="最小Issue数"
        type="number"
        placeholder="0"
        {...register("minIssues")}
      />
      <Input
        label="最大Issue数"
        type="number"
        placeholder="0"
        {...register("maxIssues")}
      />
    </div>
  );
};
