import { z } from "zod";

export const registrationSchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
});
