import { z } from "zod";

const rangeSchema = z.object({
  min: z.coerce.number().nullable().optional(),
  max: z.coerce.number().nullable().optional(),
});

export const searchSchema = z.object({
  keyword: z.string().min(1, "キーワードを入力してください"),
  star: rangeSchema,
  watcher: rangeSchema,
  fork: rangeSchema,
  issue: rangeSchema,
});

export type SearchFormData = z.infer<typeof searchSchema>;
