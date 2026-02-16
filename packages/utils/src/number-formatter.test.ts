import { describe, it, expect } from "vitest";
import { formatNumber, formatTypeSchema } from "./number-formatter";

describe("formatTypeSchema", () => {
  it("accepts valid format types", () => {
    expect(formatTypeSchema.parse("percentage")).toBe("percentage");
    expect(formatTypeSchema.parse("integer")).toBe("integer");
    expect(formatTypeSchema.parse("compact")).toBe("compact");
    expect(formatTypeSchema.parse("number")).toBe("number");
    expect(formatTypeSchema.parse("decimal-2")).toBe("decimal-2");
    expect(formatTypeSchema.parse("decimal-10")).toBe("decimal-10");
  });

  it("rejects invalid decimal formats", () => {
    expect(() => formatTypeSchema.parse("decimal-")).toThrow();
    expect(() => formatTypeSchema.parse("decimal-abc")).toThrow();
  });
});

describe("formatNumber", () => {
  describe("null/undefined handling", () => {
    it("returns value as-is when format is null", () => {
      expect(formatNumber(42, null)).toBe(42);
      expect(formatNumber("hello", null)).toBe("hello");
    });

    it("returns value as-is when format is undefined", () => {
      expect(formatNumber(42, undefined)).toBe(42);
    });

    it("returns value as-is when value is null", () => {
      expect(formatNumber(null, "percentage")).toBe(null);
    });

    it("returns value as-is when value is undefined", () => {
      expect(formatNumber(undefined, "percentage")).toBe(undefined);
    });
  });

  describe("NaN handling", () => {
    it("returns non-numeric value as-is", () => {
      expect(formatNumber("hello", "percentage")).toBe("hello");
      expect(formatNumber("abc", "integer")).toBe("abc");
    });
  });

  describe("percentage format", () => {
    it("formats as percentage (multiplied by 100)", () => {
      expect(formatNumber(0.5, "percentage")).toBe("50.00%");
      expect(formatNumber(1, "percentage")).toBe("100.00%");
      expect(formatNumber(0.1234, "percentage")).toBe("12.34%");
    });

    it("handles zero", () => {
      expect(formatNumber(0, "percentage")).toBe("0.00%");
    });

    it("handles negative values", () => {
      expect(formatNumber(-0.25, "percentage")).toBe("-25.00%");
    });
  });

  describe("integer format", () => {
    it("formats as integer with no decimals", () => {
      expect(formatNumber(42.7, "integer")).toBe("43");
      expect(formatNumber(42.3, "integer")).toBe("42");
    });

    it("formats large numbers with commas", () => {
      expect(formatNumber(1000000, "integer")).toBe("1,000,000");
    });
  });

  describe("compact format", () => {
    it("formats large numbers compactly", () => {
      expect(formatNumber(1000, "compact")).toBe("1K");
      expect(formatNumber(1000000, "compact")).toBe("1M");
    });

    it("handles small numbers", () => {
      expect(formatNumber(5, "compact")).toBe("5");
    });
  });

  describe("number format", () => {
    it("formats with default locale formatting", () => {
      expect(formatNumber(1234.56, "number")).toBe("1,234.56");
    });

    it("handles integers", () => {
      expect(formatNumber(1000, "number")).toBe("1,000");
    });
  });

  describe("decimal-N format", () => {
    it("formats with specified decimal places", () => {
      expect(formatNumber(3.14159, "decimal-2")).toBe("3.14");
      expect(formatNumber(3.14159, "decimal-4")).toBe("3.1416");
    });

    it("pads with zeros when needed", () => {
      expect(formatNumber(5, "decimal-3")).toBe("5.000");
    });

    it("handles decimal-0 like integer but without rounding to int formatting", () => {
      expect(formatNumber(42.7, "decimal-0")).toBe("43");
    });
  });

  describe("decimal: prefix (legacy format)", () => {
    it("converts decimal:N to decimal-N and formats", () => {
      expect(formatNumber(3.14159, "decimal:2")).toBe("3.14");
      expect(formatNumber(3.14159, "decimal:4")).toBe("3.1416");
    });
  });

  describe("unknown format", () => {
    it("returns value as-is for unknown format", () => {
      expect(formatNumber(42, "unknown-format")).toBe(42);
    });
  });
});
