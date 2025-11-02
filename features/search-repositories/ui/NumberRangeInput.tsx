import React from "react";
import { Input } from "@/shared/ui/Input";
import { UseFormRegister, FieldError } from "react-hook-form";
import { SearchFormData } from "../model/searchSchema";

interface NumberRangeInputProps {
  label: string;
  fieldName: "star" | "fork" | "size";
  register: UseFormRegister<SearchFormData>;
  errors?: { min?: FieldError; max?: FieldError };
}

export const NumberRangeInput: React.FC<NumberRangeInputProps> = ({
  label,
  fieldName,
  register,
  errors,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label={`最小${label}`}
        type="text"
        placeholder="0"
        error={errors?.min?.message}
        {...register(`${fieldName}.min`)}
      />
      <Input
        label={`最大${label}`}
        type="text"
        placeholder="10000"
        error={errors?.max?.message}
        {...register(`${fieldName}.max`)}
      />
    </div>
  );
};
