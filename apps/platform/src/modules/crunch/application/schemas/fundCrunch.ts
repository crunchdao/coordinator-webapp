import { z } from "zod";

export const fundCrunchSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(10_000_000, "Amount cannot exceed 10,000,000 USDC"),
});

export type FundCrunchFormData = z.infer<typeof fundCrunchSchema>;
