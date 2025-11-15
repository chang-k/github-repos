import { z } from "zod";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

const numberStringSchema = z.string().refine(
  (val) => {
    // 空文字列は許可
    if (val === "") return true;
    // 0以上の整数のみ許可
    return /^\d+$/.test(val);
  },
  {
    message: "0以上の整数のみ記入してください",
  }
);

const rangeSchema = z
  .object({
    min: numberStringSchema,
    max: numberStringSchema,
  })
  .refine(
    (data) => {
      if (data.min !== "" && data.max !== "") {
        return Number(data.max) >= Number(data.min);
      }
      // 片方が空文字列の場合はバリデーションをスキップ
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
