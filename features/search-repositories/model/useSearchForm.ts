import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchFormData } from "./searchSchema";

export const useSearchForm = () => {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: "",
      star: { min: null, max: null },
      fork: { min: null, max: null },
      size: { min: null, max: null },
      duration: { created: "", pushed: "" },
    },
  });

  return form;
};
