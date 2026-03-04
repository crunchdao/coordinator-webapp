import { z } from "zod";

export const prizeSchema = z.object({
  prizeId: z.string(),
  timestamp: z.number(),
  model: z.string(),
  prize: z.number().nonnegative(),
});

export const prizesSchema = z
  .array(prizeSchema)
  .nonempty("Array must not be empty");

export type PrizeFormData = z.infer<typeof prizeSchema>;
