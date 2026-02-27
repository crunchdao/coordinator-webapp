import z from "zod";
import { Slice, SliceType } from "@crunchdao/slices";
import { pitchFormSchema } from "../application/schemas/pitch";
import { Season } from "@/modules/season/domain/types";

export {
  SliceType,
  type Slice,
  type KeyMetric,
  type TimelineEvent,
  type TeamMember,
} from "@crunchdao/slices";

export { Locale } from "@/modules/common/types";
export { type Season, SeasonStatus } from "@/modules/season/domain/types";

export type PitchSlice = Slice & {
  updatedAt: string;
  createdAt: string;
};

export type PitchSlicesListResponse = PitchSlice[];

export interface CreatePitchSliceBody {
  name: string;
  displayName: string;
  type: SliceType;
  nativeConfiguration: Record<string, unknown>;
  order: number;
}

export interface UpdatePitchSliceBody {
  name?: string;
  displayName?: string;
  type?: SliceType;
  nativeConfiguration?: Record<string, unknown>;
  order?: number;
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
