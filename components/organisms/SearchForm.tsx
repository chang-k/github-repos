"use client";

import React, { useState } from "react";
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { SearchFilters } from "@/components/molecules/SearchFilters";

interface SearchFormProps {
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="リポジトリ名を入力してください"
            {...register("keyword", { required: true })}
          />
        </div>
        <Button type="submit">検索</Button>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">詳細検索</span>
          <Icon type={isFiltersOpen ? "chevron-up" : "chevron-down"} />
        </button>

        {isFiltersOpen && (
          <div className="p-4 border-t border-gray-200">
            <SearchFilters register={register} />
          </div>
        )}
      </div>
    </form>
  );
};
