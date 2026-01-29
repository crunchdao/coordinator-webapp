import { z } from "zod";
import { SeasonStatus } from "../../domain/types";

export const seasonFormSchema = z.object({
  number: z.number().int().positive("Season number must be positive"),
  displayName: z.string().min(1, "Display name is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().optional(),
  status: z.nativeEnum(SeasonStatus),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  stakeGoal: z.number().positive("Stake goal must be positive"),
  bannerImageUrl: z.string().url("Invalid banner image URL"),
});

export type SeasonFormData = z.infer<typeof seasonFormSchema>;