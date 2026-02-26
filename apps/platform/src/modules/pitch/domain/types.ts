import z from "zod";
import { pitchFormSchema } from "../application/schemas/pitch";
export {
  SliceType,
  type Slice,
  type KeyMetric,
  type TimelineEvent,
  type TeamMember,
} from "@crunchdao/slices";

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

export type PitchFormData = z.infer<typeof pitchFormSchema>;
