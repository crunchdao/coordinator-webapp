import { z } from "zod";
import { PitchStatus, PitchSliceType } from "../../domain/types";

export const pitchKeyMetricSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  displayValue: z.string().min(1, "Display value is required"),
});

export const teamMemberSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  avatarImageUrl: z
    .string()
    .url("Avatar image must be a valid URL")
    .nullable()
    .optional(),
  descriptionMarkdown: z
    .string()
    .min(1, "Description is required")
    .nullable()
    .optional(),
  twitterUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
});

export const roadmapEventSchema = z.object({
  date: z.string().min(1, "Date is required"),
  markdown: z.string().min(1, "Event description is required"),
});

const basePitchSliceSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string().nullable(),
  order: z.number(),
});

export const keyMetricsSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.KEY_METRICS),
  nativeConfiguration: z.object({
    metrics: z
      .array(pitchKeyMetricSchema)
      .min(1, "At least one metric is required"),
  }),
});

export const contentSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.CONTENT),
  nativeConfiguration: z.object({
    markdown: z.string().min(1, "Content is required"),
  }),
});

export const roadmapSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.ROADMAP),
  nativeConfiguration: z.object({
    events: z
      .array(roadmapEventSchema)
      .min(1, "At least one event is required"),
  }),
});

export const teamSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.TEAM),
  nativeConfiguration: z.object({
    members: z
      .array(teamMemberSchema)
      .min(1, "At least one team member is required"),
  }),
});

export const pitchSliceSchema = z.discriminatedUnion("type", [
  keyMetricsSliceSchema,
  contentSliceSchema,
  roadmapSliceSchema,
  teamSliceSchema,
]);

export const pitchFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  websiteUrl: z.string().url().nullable().optional(),
  discordUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  externalUrl: z.string().url().nullable().optional(),
  externalUrlText: z.string().optional(),
  status: z.nativeEnum(PitchStatus),
  slices: z.array(pitchSliceSchema),
});

export type PitchFormData = z.infer<typeof pitchFormSchema>;
export type PitchSlice = z.infer<typeof pitchSliceSchema>;
export type PitchKeyMetric = z.infer<typeof pitchKeyMetricSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type RoadmapEvent = z.infer<typeof roadmapEventSchema>;
