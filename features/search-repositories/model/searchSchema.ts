import { z } from "zod";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * MEMO:
 * 以下の記事にあるように、RHFが前提でcoerceを使うとunknown判定になるため
 * <number>を追記してnumber型と明示する必要がある。
 * 
 * https://qiita.com/pkshimizu_/items/dff0348a85e073e2ce0a
 */
const rangeSchema = z
  .object({
    min: z.coerce.number<number>().nullable(),
    max: z.coerce.number<number>().nullable(),
  })
  .refine(
    (data) => {
      if (data.min !== null && data.max !== null) {
        return data.max >= data.min;
      }
      return true;
    },
    {
      message: "最大値は最小値以上である必要があります",
      path: ["max"],
    }
  );

const dateSchema = z
  .string()
  .regex(dateFormatRegex, "日付は YYYY-MM-DD 形式で入力してください")
  .or(z.literal(""));

const durationSchema = z
  .object({
    created: dateSchema,
    pushed: dateSchema,
  })
  .refine(
    (data) => {
      if (data.created !== "" && data.pushed !== "") {
        return data.pushed >= data.created;
      }
      return true;
    },
    {
      message: "最終更新日は作成日以降である必要があります",
      path: ["pushed"],
    }
  );

export const searchSchema = z.object({
  keyword: z.string().min(1, "キーワードを入力してください"),
  star: rangeSchema,
  fork: rangeSchema,
  size: rangeSchema,
  duration: durationSchema,
});

export type SearchFormData = z.infer<typeof searchSchema>;
