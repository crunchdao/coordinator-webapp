import { z } from "zod";

// Schema for filter configuration (matching FilterConfig from chart/domain/types.ts)
const filterConfigSchema = z.object({
  property: z.string().min(1, "Property is required"),
  label: z.string().min(1, "Label is required"),
  type: z.literal("select"),
  autoSelectFirst: z.boolean().optional(),
});

// Schema for gauge series config (matching GaugeSeriesConfig)
const gaugeSeriesConfigSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  label: z.string().optional(),
});

// Schema for Y axis series
const yAxisSeriesSchema = z.object({
  name: z.string().min(1, "Series name is required"),
  label: z.string().optional(),
  color: z.string().optional(),
});

// Form data schema (flattened for form usage)
export const widgetFormDataSchema = z
  .object({
    type: z.enum(["CHART", "IFRAME"]),
    displayName: z.string().min(1, "Display name is required"),
    tooltip: z.string().optional(),
    order: z.number().int().positive("Order must be a positive number"),
    endpointUrl: z.string().min(2),

    // Chart specific fields
    chartType: z.enum(["line", "gauge"]).optional(),

    // Line chart fields
    xAxisName: z.string().optional(),
    yAxisSeries: z.array(yAxisSeriesSchema).optional(),
    yAxisFormat: z.string().optional(),
    displayEvolution: z.boolean().optional(),
    displayLegend: z.boolean().optional(),
    groupByProperty: z.string().optional(),
    alertField: z.string().optional(),
    alertReasonField: z.string().optional(),

    // Gauge fields
    percentage: z.boolean().optional(),

    // Common filter config
    filterConfig: z.array(filterConfigSchema).optional(),


    // Gauge series config
    gaugeSeriesConfig: z.array(gaugeSeriesConfigSchema).optional(),
  })
  .refine((data) => {
    // Validate chart-specific fields when type is CHART
    if (data.type === "CHART") {
      if (!data.chartType) {
        return false;
      }

      if (data.chartType === "line") {
        return !!data.xAxisName && !!data.yAxisSeries && data.yAxisSeries.length > 0;
      }
    }

    return true;
  });

export type WidgetFormData = z.infer<typeof widgetFormDataSchema>;
