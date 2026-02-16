import { describe, it, expect } from "vitest";
import { isFixedColumnType, FIXED_COLUMN_TYPES } from "./utils";

describe("FIXED_COLUMN_TYPES", () => {
  it("contains MODEL and USERNAME", () => {
    expect(FIXED_COLUMN_TYPES).toContain("MODEL");
    expect(FIXED_COLUMN_TYPES).toContain("USERNAME");
  });

  it("does not contain VALUE or CHART", () => {
    expect(FIXED_COLUMN_TYPES).not.toContain("VALUE");
    expect(FIXED_COLUMN_TYPES).not.toContain("CHART");
  });
});

describe("isFixedColumnType", () => {
  it("returns true for MODEL", () => {
    expect(isFixedColumnType("MODEL")).toBe(true);
  });

  it("returns true for USERNAME", () => {
    expect(isFixedColumnType("USERNAME")).toBe(true);
  });

  it("returns false for VALUE", () => {
    expect(isFixedColumnType("VALUE")).toBe(false);
  });

  it("returns false for CHART", () => {
    expect(isFixedColumnType("CHART")).toBe(false);
  });
});
