export type OrganizerStake = {
  effective: number;
  delegated: number;
  self: number;
  stakersCount: number;
};

export type Organizer = {
  id: string;
  name: string;
  displayName: string;
  logoImageUrl: string;
  bannerImageUrl: string;
  onChainId: string;
  stake: OrganizerStake;
};

export interface OrganizerApplicationPayload {
  name: string;
  email: string;
  discordUsername: string;
  projectName: string;
  goal: string;
  evaluationMethod?: string;
  dataSources?: string;
  payoutStructure?: string;
  timeline?: string;
}

export interface UpdateOrganizerApplicationPayload {
  reviewStatus?: OrganizerApplicationReviewStatus;
}

export interface OrganizerApplicationResponse {
  id: number;
  name: string;
  email: string;
  discordUsername: string | null;
  projectName: string | null;
  goal: string | null;
  evaluationMethod: string | null;
  dataSources: string | null;
  payoutStructure: string | null;
  timeline: string | null;
  reviewStatus: OrganizerApplicationReviewStatus;
  createdAt: string;
}

export enum OrganizerApplicationReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type GetOrganizerApplicationResponse = OrganizerApplicationResponse;

export type CrunchState =
  | "Created"
  | "Started"
  | "Ended"
  | "MarginPaidout"
  | "Drained";

export interface CrunchCruncher {
  address: string;
  name: string;
  cruncherIndex: number;
}

export interface Crunch {
  address: string;
  coordinator: string;
  rewardVault: string;
  state: CrunchState;
  maxModelsPerCruncher: number;
  payoutAmount: string;
  name: string;
  crunchers: CrunchCruncher[];
}

export interface GetCrunchesParams {
  crunchNames?: string[];
  coordinator?: string;
  state?: CrunchState;
}
