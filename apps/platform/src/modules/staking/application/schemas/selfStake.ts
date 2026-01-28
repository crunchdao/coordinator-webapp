import { z } from "zod";

export const selfStakeSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
});

export type SelfStakeFormData = z.infer<typeof selfStakeSchema>;
