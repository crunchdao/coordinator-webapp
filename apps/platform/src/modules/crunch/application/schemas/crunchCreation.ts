import { z } from "zod";

export const crunchCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Crunch name is required")
    .max(32, "Crunch name must be 32 characters or less")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Crunch name can only contain alphanumeric characters, hyphens, and underscores"
    ),

  payoutAmount: z
    .number()
    .min(1, "Payout amount must be greater than 0")
    .max(1000000, "Payout amount must be less than 1,000,000 USDC"),

  maxModelsPerCruncher: z
    .number()
    .int("Must be a whole number")
    .min(1, "Must allow at least 1 model per cruncher")
    .max(5, "Cannot exceed 5 models per cruncher"),
});

export type CreateCrunchFormData = z.infer<typeof crunchCreationSchema>;
