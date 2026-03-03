import { z } from "zod";
import { slugSchema, environmentTargetSchema } from "../../domain/schemas";

const envEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  target: environmentTargetSchema,
});

export const crunchConfigCreationSchema = slugSchema.extend({
  environments: z
    .array(envEntrySchema)
    .min(1, "At least one environment is required"),
});

export type CrunchConfigCreationFormData = z.infer<
  typeof crunchConfigCreationSchema
>;
