import { describe, it, expect } from "vitest";
import { escapeRegex, MAX_WORDS, normalizeSearchParams } from "./search";


describe("escapeRegex", () => {

   it("escapes special characters", () => {
      expect(escapeRegex("c++")).toBe("c\\+\\+");
      expect(escapeRegex("a.b")).toBe("a\\.b");
   })

   it("leaves plain text untouched", () => {
      expect(escapeRegex("hello")).toBe("hello");
   })

   it("produces a regex that matches the literal text only", () => {

      const rx = new RegExp(escapeRegex("a.b"));

      expect(rx.test("a.b")).toBe(true);
      expect(rx.test("axb")).toBe(false);
   })
})



describe("normalizeSearchParams", () => {
   
   it("handles missing params", () => {
      expect(normalizeSearchParams({})).toEqual({ words: [], tags: [] });
   });


   it("treats 'q=a b' and 'q=a&q=b' the same", () => {
      const a = normalizeSearchParams({ q: "a b" });
      const b = normalizeSearchParams({ q: ["a", "b"] });
      expect(a.words).toEqual(["a", "b"]);
      expect(b.words).toEqual(a.words);
   });

   it("lowercases, strips '#' and de-duplicates tags", () => {
      const { tags } = normalizeSearchParams({ tag: ["#React", "react", "Next"] });
      expect(tags).toEqual(["react", "next"]);
   });

   it("caps the number of words", () => {
      const q = Array.from({ length: 50 }, (_, i) => `w${i}`).join(" ");
      expect(normalizeSearchParams({ q }).words.length).toBeLessThanOrEqual(MAX_WORDS);
   });
});