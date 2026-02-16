import { describe, it, expect } from "vitest";
import { widgetFormDataSchema } from "./widgetFormSchema";

describe("widgetFormDataSchema", () => {
  const validIframe = {
    type: "IFRAME" as const,
    displayName: "My Widget",
    order: 1,
    endpointUrl: "/api/data",
  };

  const validLineChart = {
    type: "CHART" as const,
    displayName: "Score Chart",
    order: 1,
    endpointUrl: "/api/data",
    chartType: "line" as const,
    xAxisName: "date",
    yAxisSeries: [{ name: "score", label: "Score" }],
  };

  const validGaugeChart = {
    type: "CHART" as const,
    displayName: "Gauge",
    order: 1,
    endpointUrl: "/api/data",
    chartType: "gauge" as const,
  };

  describe("IFRAME type", () => {
    it("accepts valid iframe widget", () => {
      const result = widgetFormDataSchema.safeParse(validIframe);
      expect(result.success).toBe(true);
    });

    it("requires displayName", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validIframe,
        displayName: "",
      });
      expect(result.success).toBe(false);
    });

    it("requires positive order", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validIframe,
        order: 0,
      });
      expect(result.success).toBe(false);
    });

    it("requires endpointUrl min length 2", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validIframe,
        endpointUrl: "/",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CHART type - line", () => {
    it("accepts valid line chart", () => {
      const result = widgetFormDataSchema.safeParse(validLineChart);
      expect(result.success).toBe(true);
    });

    it("requires chartType for CHART", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        chartType: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("requires xAxisName for line chart", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        xAxisName: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("requires at least one yAxisSeries for line chart", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        yAxisSeries: [],
      });
      expect(result.success).toBe(false);
    });

    it("requires yAxisSeries name to be non-empty", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        yAxisSeries: [{ name: "" }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CHART type - gauge", () => {
    it("accepts valid gauge chart", () => {
      const result = widgetFormDataSchema.safeParse(validGaugeChart);
      expect(result.success).toBe(true);
    });

    it("accepts gauge with percentage option", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validGaugeChart,
        percentage: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("CHART type - bar", () => {
    const validBarChart = {
      type: "CHART" as const,
      displayName: "Multi-Metric",
      order: 1,
      endpointUrl: "/api/data",
      chartType: "bar" as const,
      categoryProperty: "metric",
      valueProperties: [{ name: "value", label: "Value" }],
    };

    it("accepts valid bar chart", () => {
      const result = widgetFormDataSchema.safeParse(validBarChart);
      expect(result.success).toBe(true);
    });

    it("requires categoryProperty for bar chart", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validBarChart,
        categoryProperty: undefined,
      });
      expect(result.success).toBe(false);
    });

    it("requires at least one valueProperty for bar chart", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validBarChart,
        valueProperties: [],
      });
      expect(result.success).toBe(false);
    });

    it("requires valueProperty name to be non-empty", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validBarChart,
        valueProperties: [{ name: "" }],
      });
      expect(result.success).toBe(false);
    });

    it("accepts bar chart with optional fields", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validBarChart,
        stacked: true,
        horizontal: true,
        barFormat: "decimal-2",
        groupByProperty: "model_id",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("optional fields", () => {
    it("accepts tooltip", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validIframe,
        tooltip: "Help text",
      });
      expect(result.success).toBe(true);
    });

    it("accepts filterConfig", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        filterConfig: [
          {
            property: "asset",
            label: "Asset",
            type: "select",
            autoSelectFirst: true,
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects filterConfig with empty property", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        filterConfig: [{ property: "", label: "Asset", type: "select" }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects filterConfig with empty label", () => {
      const result = widgetFormDataSchema.safeParse({
        ...validLineChart,
        filterConfig: [{ property: "asset", label: "", type: "select" }],
      });
      expect(result.success).toBe(false);
    });
  });
});
