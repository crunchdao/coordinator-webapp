import { z } from "zod";
import { sliceSchema, type Slice } from "@crunchdao/slices";

export const pitchFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  websiteUrl: z.string().url().nullable().optional(),
  discordUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  externalUrl: z.string().url().nullable().optional(),
  externalUrlText: z.string().optional(),
  slices: z.array(sliceSchema),
});

export type PitchFormData = z.infer<typeof pitchFormSchema>;
export type PitchSlice = Slice;
