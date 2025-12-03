import { z } from "zod";

export const formatTypeSchema = z.union([
  z.literal("percentage"),
  z.literal("integer"),
  z.literal("compact"),
  z.string().regex(/^decimal-\d+$/),
]);

export const columnTypeSchema = z.enum(["PROJECT", "VALUE", "STATUS", "CHART"]);

const gaugeSeriesConfigSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  label: z.string().optional(),
});

const gaugeConfigurationSchema = z.object({
  type: z.literal("gauge"),
  percentage: z.boolean().optional(),
  seriesConfig: z.array(gaugeSeriesConfigSchema).optional(),
});

export const createLeaderboardColumnSchema = z.object({
  type: columnTypeSchema,
  property: z.string().min(1, "Property is required"),
  format: formatTypeSchema.nullable(),
  display_name: z.string().nullable(),
  tooltip: z.string().nullable(),
  native_configuration: gaugeConfigurationSchema.nullable(),
  order: z.number().int().min(0),
});
