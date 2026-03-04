import { z } from "zod";

export const updateCompetitionSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  fullName: z.string().min(1, "Full name is required").optional(),
  shortDescription: z.string().optional(),
  start: z.string().datetime({ offset: true }).optional(),
  end: z.string().datetime({ offset: true }).optional(),
  visibility: z.enum(["HIDDEN", "PUBLIC"]).optional(),
  cardImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  bannerImageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  documentationUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  notebookUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  advancedNotebookUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  discussionUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  codeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  ruleContentUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  prizePoolText: z.string().optional(),
  prizePoolShortText: z.string().optional(),
  prizePoolUsd: z.number().min(0, "Prize pool must be positive").optional(),
});

export type UpdateCompetitionFormData = z.infer<typeof updateCompetitionSchema>;
