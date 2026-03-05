import { z } from "zod";
import { slugSchema, environmentSchema } from "../../domain/schemas";

export const crunchConfigCreationSchema = slugSchema.extend({
  environments: z
    .array(environmentSchema)
    .min(1, "At least one environment is required"),
});

export type CrunchConfigCreationFormData = z.infer<
  typeof crunchConfigCreationSchema
>;
