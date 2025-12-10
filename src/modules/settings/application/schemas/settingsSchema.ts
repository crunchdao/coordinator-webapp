import { z } from "zod";

export const globalSettingsSchema = z.object({
  endpoints: z.object({
    leaderboard: z.string().min(1, "Endpoint is required"),
  }),
  logs: z.object({
    containerNames: z
      .array(z.string().min(1, "Container name cannot be empty"))
      .min(1, "At least one container name is required"),
  }),
});

export type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;
