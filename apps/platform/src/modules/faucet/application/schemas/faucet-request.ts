import { z } from "zod";

export const faucetRequestSchema = z.object({
  amount: z.number().min(1).max(100),
});
