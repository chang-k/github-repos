import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { SearchFormData } from "../model/searchSchema";

interface DateInputProps {
  label: string;
  placeholder?: string;
  fieldName: "duration.created" | "duration.pushed";
  register: UseFormRegister<SearchFormData>;
  error?: FieldError;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  placeholder = "YYYY-MM-DD",
  fieldName,
  register,
  error,
}) => {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        {...register(fieldName)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
