"use client";

import React from "react";
import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";
import { FilterAccordion } from "./FilterAccordion";
import { NumberRangeInput } from "./NumberRangeInput";
import { useSearchForm } from "../model/useSearchForm";
import { buildSearchQuery } from "../model/buildSearchQuery";

interface SearchFormProps {
  onSearch: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { register, handleSubmit, errors } = useSearchForm(onSearch);

  const onSubmit = (data: any) => {
    const query = buildSearchQuery(data);
    onSearch(query);
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
          />
          <NumberRangeInput
            label="Watcher数"
            fieldName="watcher"
            register={register}
          />
          <NumberRangeInput
            label="Fork数"
            fieldName="fork"
            register={register}
          />
          <NumberRangeInput
            label="Issue数"
            fieldName="issue"
            register={register}
          />
        </div>
      </FilterAccordion>
    </form>
  );
};
