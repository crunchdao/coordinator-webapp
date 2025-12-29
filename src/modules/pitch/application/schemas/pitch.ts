import { z } from "zod";
import { PitchStatus, PitchSliceType } from "../../domain/types";

export const pitchKeyMetricSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  displayValue: z.string().min(1, "Display value is required"),
});

export const teamMemberSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  role: z.string().min(1, "Role is required"),
  avatarImageUrl: z.string().url().nullable().optional(),
  crunchbaseUrl: z.string().url().nullable().optional(),
  farcasterUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  linkedinUrl: z.string().url().nullable().optional(),
  telegramUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  websiteUrl: z.string().url().nullable().optional(),
});

export const roadmapEventSchema = z.object({
  date: z.string().min(1, "Date is required"),
  event: z.string().min(1, "Event description is required"),
});

const basePitchSliceSchema = z.object({
  id: z.string(),
  isEnabled: z.boolean(),
  order: z.number(),
});

export const keyMetricsSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.KEY_METRICS),
  metrics: z
    .array(pitchKeyMetricSchema)
    .min(1, "At least one metric is required"),
});

export const contentSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.CONTENT),
  content: z.string().min(1, "Content is required"),
});

export const roadmapSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.ROADMAP),
  events: z.array(roadmapEventSchema).min(1, "At least one event is required"),
});

export const teamSliceSchema = basePitchSliceSchema.extend({
  type: z.literal(PitchSliceType.TEAM),
  members: z
    .array(teamMemberSchema)
    .min(1, "At least one team member is required"),
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
