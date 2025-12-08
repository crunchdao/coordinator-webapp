import { z } from "zod";

export const globalSettingsSchema = z.object({
  apiBaseUrl: z.string().url("Must be a valid URL"),
  endpoints: z.object({
    leaderboard: z.string().min(1, "Endpoint is required")
  })
});

export type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;