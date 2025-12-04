import { z } from "zod";

const FilterConfigSchema = z.object({
  property: z.string(),
  label: z.string(),
  type: z.literal("select"),
  autoSelectFirst: z.boolean().optional(),
});

const LineChartSeriesConfigSchema = z.record(
  z.string(),
  z.object({
    color: z.string().optional(),
    label: z.string().optional(),
  })
);

const LineChartConfigurationSchema = z.object({
  xAxis: z.object({ name: z.string() }),
  yAxis: z.union([
    z.object({ name: z.string(), format: z.string().optional() }),
    z.object({ names: z.array(z.string()), format: z.string().optional() }),
  ]),
  displayEvolution: z.boolean(),
  displayLegend: z.boolean().optional(),
  tooltip: z.string().optional(),
  groupByProperty: z.string().optional(),
  alertConfig: z
    .object({
      field: z.string(),
      reasonField: z.string(),
    })
    .optional(),
  filterConfig: z.array(FilterConfigSchema).optional(),
  seriesConfig: LineChartSeriesConfigSchema.optional(),
});

const GaugeSeriesConfigSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  label: z.string().optional(),
});

const GaugeConfigurationSchema = z.object({
  type: z.literal("gauge"),
  percentage: z.boolean().optional(),
  seriesConfig: z.array(GaugeSeriesConfigSchema).optional(),
  filterConfig: z.array(FilterConfigSchema).optional(),
});

const MetricTypeSchema = z.enum(["CHART", "IFRAME"]);

const BaseWidgetSchema = z.object({
  name: z.string(),
  type: MetricTypeSchema,
  displayName: z.string(),
  tooltip: z.string().nullable().optional(),
  order: z.number(),
  endpointUrl: z.string().min(2),
});

const IframeWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("IFRAME"),
});

const ChartWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("CHART"),
  nativeConfiguration: z.union([
    LineChartConfigurationSchema,
    GaugeConfigurationSchema,
  ]),
});

export const createMetricWidgetSchema = z.discriminatedUnion("type", [
  ChartWidgetSchema,
  IframeWidgetSchema,
]);

export const updateMetricWidgetSchema = z.discriminatedUnion("type", [
  ChartWidgetSchema.partial().required({ type: true }),
  IframeWidgetSchema.partial().required({ type: true }),
]);

export type CreateMetricWidgetInput = z.infer<typeof createMetricWidgetSchema>;
export type UpdateMetricWidgetInput = z.infer<typeof updateMetricWidgetSchema>;
