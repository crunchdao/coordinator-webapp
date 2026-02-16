import { describe, it, expect } from "vitest";
import { parseAnsiToSegments } from "./ansiParser";

describe("parseAnsiToSegments", () => {
  it("returns plain text as single segment", () => {
    const segments = parseAnsiToSegments("hello world");
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe("hello world");
  });

  it("parses red text (code 31)", () => {
    const segments = parseAnsiToSegments("\x1b[31mhello\x1b[0m");
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ text: "hello", style: { color: "#ef4444" } });
  });

  it("parses green text (code 32)", () => {
    const segments = parseAnsiToSegments("\x1b[32msuccess\x1b[0m");
    expect(segments[0]).toEqual({
      text: "success",
      style: { color: "#22c55e" },
    });
  });

  it("parses bold text (code 1)", () => {
    const segments = parseAnsiToSegments("\x1b[1mbold text\x1b[0m");
    expect(segments[0]).toEqual({
      text: "bold text",
      style: { fontWeight: "bold" },
    });
  });

  it("parses italic text (code 3)", () => {
    const segments = parseAnsiToSegments("\x1b[3mitalic\x1b[0m");
    expect(segments[0]).toEqual({
      text: "italic",
      style: { fontStyle: "italic" },
    });
  });

  it("parses underline text (code 4)", () => {
    const segments = parseAnsiToSegments("\x1b[4munderlined\x1b[0m");
    expect(segments[0]).toEqual({
      text: "underlined",
      style: { textDecoration: "underline" },
    });
  });

  it("parses combined codes (bold + red)", () => {
    const segments = parseAnsiToSegments("\x1b[1;31merror\x1b[0m");
    expect(segments[0]).toEqual({
      text: "error",
      style: { fontWeight: "bold", color: "#ef4444" },
    });
  });

  it("parses background colors", () => {
    const segments = parseAnsiToSegments("\x1b[41mred bg\x1b[0m");
    expect(segments[0]).toEqual({
      text: "red bg",
      style: { backgroundColor: "#ef4444" },
    });
  });

  it("handles text before and after ANSI codes", () => {
    const segments = parseAnsiToSegments("before \x1b[31mred\x1b[0m after");
    expect(segments).toHaveLength(3);
    expect(segments[0].text).toBe("before ");
    expect(segments[1].text).toBe("red");
    expect(segments[1].style?.color).toBe("#ef4444");
    expect(segments[2].text).toBe(" after");
  });

  it("handles reset code (0) clearing styles", () => {
    const segments = parseAnsiToSegments(
      "\x1b[1;31mbold red\x1b[0mnormal"
    );
    expect(segments[0].style).toEqual({
      fontWeight: "bold",
      color: "#ef4444",
    });
    expect(segments[1].style).toEqual({});
  });

  it("handles empty string", () => {
    const segments = parseAnsiToSegments("");
    expect(segments).toEqual([]);
  });

  it("handles multiple color switches", () => {
    const segments = parseAnsiToSegments(
      "\x1b[31mred\x1b[32mgreen\x1b[34mblue\x1b[0m"
    );
    expect(segments[0].style?.color).toBe("#ef4444");
    expect(segments[1].style?.color).toBe("#22c55e");
    expect(segments[2].style?.color).toBe("#3b82f6");
  });

  it("parses bright/high intensity colors (90-97)", () => {
    const segments = parseAnsiToSegments("\x1b[91mbright red\x1b[0m");
    expect(segments[0].style?.color).toBe("#f87171");
  });

  it("parses bright background colors (100-107)", () => {
    const segments = parseAnsiToSegments("\x1b[101mbright red bg\x1b[0m");
    expect(segments[0].style?.backgroundColor).toBe("#f87171");
  });
});
