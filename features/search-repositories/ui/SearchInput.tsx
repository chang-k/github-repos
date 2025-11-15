import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import { SearchFormData } from "../model/searchSchema";

interface SearchInputProps {
  register: UseFormRegister<SearchFormData>;
  error?: FieldErrors<SearchFormData>["keyword"];
}

export const SearchInput: React.FC<SearchInputProps> = ({
  register,
  error,
}) => {
  return (
    <Input
      placeholder="リポジトリ名を入力してください"
      error={error?.message}
      {...register("keyword")}
    />
  );
};
