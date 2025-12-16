import { z } from "zod";

export const updateModelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  path: z.string().min(1, "Path is required"),
  desiredState: z.string().min(1, "Desired state is required"),
});
