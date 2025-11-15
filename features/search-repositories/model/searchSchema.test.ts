import { describe, it, expect } from "vitest";
import { searchSchema } from "./searchSchema";

describe("searchSchema", () => {
  describe("keyword", () => {
    it("空文字列の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "キーワードを入力してください"
        );
      }
    });

    it("文字列が入力されている場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("star", () => {
    it("数値文字列の場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "100", max: "1000" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });

    it("負の数の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "-100", max: "1000" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "0以上の整数のみ記入してください"
        );
      }
    });

    it("小数の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "12.5", max: "1000" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "0以上の整数のみ記入してください"
        );
      }
    });

    it("文字列が含まれる場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "100a", max: "1000" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "0以上の整数のみ記入してください"
        );
      }
    });

    it("max < min の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "1000", max: "100" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "最大値は最小値以上である必要があります"
        );
      }
    });

    it("min のみの場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "100", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });

    it("max のみの場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "1000" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("fork", () => {
    it("数値文字列の場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "10", max: "100" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });

    it("max < min の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "100", max: "10" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "最大値は最小値以上である必要があります"
        );
      }
    });
  });

  describe("size", () => {
    it("数値文字列の場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "100", max: "500" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });

    it("max < min の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "500", max: "100" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "最大値は最小値以上である必要があります"
        );
      }
    });
  });

  describe("duration", () => {
    it("YYYY-MM-DD 形式の日付が成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "2024-01-01", pushed: "2024-12-31" },
      });

      expect(result.success).toBe(true);
    });

    it("YYYY-MM-DD 以外の形式の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "2024/01/01", pushed: "" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "日付は YYYY-MM-DD 形式で入力してください"
        );
      }
    });

    it("pushed < created の場合、エラーになる", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "2024-12-31", pushed: "2024-01-01" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "最終更新日は作成日以降である必要があります"
        );
      }
    });

    it("created のみの場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "2024-01-01", pushed: "" },
      });

      expect(result.success).toBe(true);
    });

    it("pushed のみの場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "2024-12-31" },
      });

      expect(result.success).toBe(true);
    });

    it("空文字列の場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "" },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("複数条件の組み合わせ", () => {
    it("すべての条件が正しい場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "react",
        star: { min: "100", max: "1000" },
        fork: { min: "10", max: "100" },
        size: { min: "100", max: "500" },
        duration: { created: "2024-01-01", pushed: "2024-12-31" },
      });

      expect(result.success).toBe(true);
    });

    it("一部の条件のみ入力されている場合、成功", () => {
      const result = searchSchema.safeParse({
        keyword: "vue",
        star: { min: "50", max: "" },
        fork: { min: "", max: "" },
        size: { min: "", max: "" },
        duration: { created: "", pushed: "2024-12-31" },
      });

      expect(result.success).toBe(true);
    });
  });
});
