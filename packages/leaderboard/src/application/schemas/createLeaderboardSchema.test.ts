import { describe, it, expect } from "vitest";
import {
  createLeaderboardColumnSchema,
  editFixedColumnSchema,
} from "./createLeaderboardSchema";

describe("createLeaderboardColumnSchema", () => {
  const validColumn = {
    type: "VALUE",
    property: "score",
    format: "decimal-2",
    displayName: "Score",
    tooltip: "The score",
    nativeConfiguration: null,
    order: 0,
  };

  it("accepts a valid column definition", () => {
    const result = createLeaderboardColumnSchema.safeParse(validColumn);
    expect(result.success).toBe(true);
  });

  it("accepts all column types", () => {
    for (const type of ["MODEL", "VALUE", "CHART", "USERNAME"]) {
      const result = createLeaderboardColumnSchema.safeParse({
        ...validColumn,
        type,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid column type", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      type: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("requires property to be non-empty", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      property: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires displayName to be non-empty", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      displayName: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null format", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      format: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all format types", () => {
    for (const format of [
      "percentage",
      "integer",
      "compact",
      "number",
      "decimal-4",
    ]) {
      const result = createLeaderboardColumnSchema.safeParse({
        ...validColumn,
        format,
      });
      expect(result.success).toBe(true);
    }
  });

  it("requires order to be a non-negative integer", () => {
    const negativeResult = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      order: -1,
    });
    expect(negativeResult.success).toBe(false);

    const floatResult = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      order: 1.5,
    });
    expect(floatResult.success).toBe(false);
  });

  it("accepts null tooltip", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      tooltip: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts gauge native configuration", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      nativeConfiguration: {
        type: "gauge",
        percentage: true,
        seriesConfig: [{ name: "s1", color: "#ff0000", label: "Series 1" }],
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts model native configuration", () => {
    const result = createLeaderboardColumnSchema.safeParse({
      ...validColumn,
      nativeConfiguration: {
        type: "model",
        statusProperty: "status",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("editFixedColumnSchema", () => {
  it("accepts valid property", () => {
    const result = editFixedColumnSchema.safeParse({ property: "model_id" });
    expect(result.success).toBe(true);
  });

  it("rejects empty property", () => {
    const result = editFixedColumnSchema.safeParse({ property: "" });
    expect(result.success).toBe(false);
  });
});
