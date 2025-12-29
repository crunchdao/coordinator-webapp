import z from "zod";
import {
  pitchFormSchema,
  pitchKeyMetricSchema,
  pitchSliceSchema,
  roadmapEventSchema,
  teamMemberSchema,
} from "../application/schemas/pitch";

export enum SeasonStatus {
  VOTING = "VOTING",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface Season {
  id: number;
  number: number;
  displayName: string;
  shortDescription: string;
  description?: string;
  status: SeasonStatus;
  start: string;
  end: string;
  stakeGoal: number | string;
  bannerImageUrl: string;
}

export enum PitchStatus {
  VOTING = "VOTING",
  CANCELED = "CANCELED",
}

export interface OrganizerStake {
  effective: number;
  delegated: number;
  self: number;
  stakersCount: number;
}

export interface Organizer {
  id: string;
  name: string;
  displayName: string;
  logoImageUrl: string;
  bannerImageUrl: string;
  onChainId: string;
  stake: OrganizerStake;
}

export interface Pitch {
  id: number;
  name: string;
  displayName: string;
  shortDescription: string;
  season?: Season;
  organizer: Organizer;
  websiteUrl: string | null;
  discordUrl: string | null;
  twitterUrl: string | null;
  externalUrl: string | null;
  externalUrlText: string | null;
  createdAt: Date;
  stake: OrganizerStake;
  status: PitchStatus;
}

export interface BasePitchSlice {
  id: string;
  type: PitchSliceType;
  isEnabled: boolean;
  order: number;
}

export enum PitchSliceType {
  KEY_METRICS = "KEY_METRICS",
  CONTENT = "CONTENT",
  ROADMAP = "ROADMAP",
  TEAM = "TEAM",
}

export type PitchFormData = z.infer<typeof pitchFormSchema>;
export type PitchSlice = z.infer<typeof pitchSliceSchema>;
export type PitchKeyMetric = z.infer<typeof pitchKeyMetricSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type RoadmapEvent = z.infer<typeof roadmapEventSchema>;
