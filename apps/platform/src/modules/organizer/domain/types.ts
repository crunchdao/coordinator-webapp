import { z } from "zod";
import {
  PaginatedRequestParams,
  PaginatedResponse,
} from "@/modules/common/domain/pagination";
import {
  createOrganizerMemberSchema,
  updateOrganizerMemberSchema,
} from "../application/schemas/organizerMemberSchema";
import { updateOrganizerSchema } from "../application/schemas/updateOrganizerSchema";

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

export type GetOrganizerApplicationsPayload = PaginatedRequestParams & {
  sort?: "RECENT" | "OLDEST";
  reviewStatus?: OrganizerApplicationReviewStatus | null;
  potentialSpam?: boolean | null;
};

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

export type GetOrganizerApplicationsResponse =
  PaginatedResponse<OrganizerApplicationResponse>;

export type GetOrganizerApplicationResponse = OrganizerApplicationResponse;

export enum OrganizerMemberRole {
  STAFF = "STAFF",
  ADMINISTRATOR = "ADMINISTRATOR",
}

export interface OrganizerMemberUser {
  id: number;
  login: string;
}

export interface OrganizerMember {
  id: number;
  user: OrganizerMemberUser;
  role: OrganizerMemberRole;
  createdAt: string;
}

export type OrganizerMemberCreateForm = z.infer<
  typeof createOrganizerMemberSchema
>;
export type OrganizerMemberUpdateForm = z.infer<
  typeof updateOrganizerMemberSchema
>;

export type OrganizerUpdateForm = z.infer<typeof updateOrganizerSchema>;

export type GetOrganizersParams = PaginatedRequestParams & {
  name?: string;
  member?: boolean;
  sort?: "RECENT" | "OLDEST";
};

export type GetOrganizersResponse = PaginatedResponse<Organizer>;
export type GetOrganizerMembersResponse = PaginatedResponse<OrganizerMember>;
export type GetOrganizerMemberResponse = OrganizerMember;
