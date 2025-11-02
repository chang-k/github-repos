import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, SearchFormData } from "./searchSchema";

export const useSearchForm = () => {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: "",
      star: { min: "", max: "" },
      fork: { min: "", max: "" },
      size: { min: "", max: "" },
      duration: { created: "", pushed: "" },
    },
  });

  return form;
};
