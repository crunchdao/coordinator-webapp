import { describe, it, expect } from "vitest";
import { markdownToHtml } from "./utils";

describe("markdownToHtml", () => {
  describe("headings", () => {
    it("converts h1", () => {
      expect(markdownToHtml("# Hello")).toBe(
        "<h1 class='text-3xl'>Hello</h1>"
      );
    });

    it("converts h2", () => {
      expect(markdownToHtml("## Hello")).toBe(
        "<h2 class='text-2xl'>Hello</h2>"
      );
    });

    it("converts h3", () => {
      expect(markdownToHtml("### Hello")).toBe(
        "<h3 class='text-xl'>Hello</h3>"
      );
    });

    it("only converts headings at start of line", () => {
      expect(markdownToHtml("not # a heading")).toBe("not # a heading");
    });
  });

  describe("inline formatting", () => {
    it("converts bold text", () => {
      expect(markdownToHtml("**bold**")).toBe("<b>bold</b>");
    });

    it("converts italic text", () => {
      expect(markdownToHtml("*italic*")).toBe("<em>italic</em>");
    });

    it("converts inline code", () => {
      expect(markdownToHtml("`code`")).toBe("<code>code</code>");
    });

    it("preserves underline HTML tags", () => {
      expect(markdownToHtml("<u>underlined</u>")).toBe("<u>underlined</u>");
    });
  });

  describe("line breaks", () => {
    it("converts newlines to <br/>", () => {
      expect(markdownToHtml("line1\nline2")).toBe("line1<br/>line2");
    });

    it("handles multiple newlines", () => {
      expect(markdownToHtml("a\n\nb")).toBe("a<br/><br/>b");
    });
  });

  describe("combined formatting", () => {
    it("handles heading with bold inside", () => {
      expect(markdownToHtml("# **Bold Title**")).toBe(
        "<h1 class='text-3xl'><b>Bold Title</b></h1>"
      );
    });

    it("handles multiple inline styles", () => {
      const result = markdownToHtml("**bold** and *italic* and `code`");
      expect(result).toBe("<b>bold</b> and <em>italic</em> and <code>code</code>");
    });
  });
});
