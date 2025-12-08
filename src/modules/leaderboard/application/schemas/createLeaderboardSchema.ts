import { z } from "zod";

export const formatTypeSchema = z.union([
  z.literal("percentage"),
  z.literal("integer"),
  z.literal("compact"),
  z.string().regex(/^decimal-\d+$/),
]);

export const columnTypeSchema = z.enum(["MODEL", "VALUE", "CHART", "USERNAME"]);

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

const projectConfigurationSchema = z.object({
  type: z.literal("model"),
  statusProperty: z.string().optional(),
});

const nativeConfigurationSchema = z.discriminatedUnion("type", [
  gaugeConfigurationSchema,
  projectConfigurationSchema,
]);

export const createLeaderboardColumnSchema = z.object({
  type: columnTypeSchema,
  property: z.string().min(1, "Property is required"),
  format: formatTypeSchema.nullable().optional(),
  displayName: z.string().min(1, "Display name is required"),
  tooltip: z.string().nullable().optional(),
  nativeConfiguration: z
    .union([nativeConfigurationSchema, z.null()])
    .optional(),
  order: z.number().int().min(0),
});
