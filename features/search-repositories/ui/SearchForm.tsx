"use client";

import React from "react";
import { SearchFormData } from "../model/searchSchema";
import { useSearchForm } from "../model/useSearchForm";
import { DateInput } from "./DateInput";
import { FilterAccordion } from "./FilterAccordion";
import { NumberRangeInput } from "./NumberRangeInput";
import { SearchButton } from "./SearchButton";
import { SearchInput } from "./SearchInput";

interface SearchFormProps {
  onSearch: (formData: SearchFormData) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useSearchForm();

  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchInput register={register} error={errors.keyword} />
        </div>
        <SearchButton type="submit" />
      </div>

      <FilterAccordion>
        <div className="space-y-4">
          <NumberRangeInput
            label="Star数"
            fieldName="star"
            register={register}
            errors={errors.star}
          />
          <NumberRangeInput
            label="Fork数"
            fieldName="fork"
            register={register}
            errors={errors.fork}
          />
          <NumberRangeInput
            label="サイズ (KB)"
            fieldName="size"
            register={register}
            errors={errors.size}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              期間
            </label>
            <div className="grid grid-cols-2 gap-2">
              <DateInput
                label="作成日 (YYYY-MM-DD)"
                placeholder="2025-01-01"
                fieldName="duration.created"
                register={register}
                error={errors.duration?.created}
              />
              <DateInput
                label="最終更新日 (YYYY-MM-DD)"
                placeholder="2025-12-31"
                fieldName="duration.pushed"
                register={register}
                error={errors.duration?.pushed}
              />
            </div>
          </div>
        </div>
      </FilterAccordion>
    </form>
  );
};
