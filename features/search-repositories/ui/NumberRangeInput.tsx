import React from "react";
import { Input } from "@/shared/ui/Input";
import { UseFormRegister } from "react-hook-form";
import { SearchFormData } from "../model/searchSchema";

interface NumberRangeInputProps {
  label: string;
  fieldName: "star" | "watcher" | "fork" | "issue";
  register: UseFormRegister<SearchFormData>;
}

export const NumberRangeInput: React.FC<NumberRangeInputProps> = ({
  label,
  fieldName,
  register,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        label={`最小${label}`}
        type="number"
        placeholder="0"
        {...register(`${fieldName}.min`)}
      />
      <Input
        label={`最大${label}`}
        type="number"
        placeholder="0"
        {...register(`${fieldName}.max`)}
      />
    </div>
  );
};
