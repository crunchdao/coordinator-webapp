import {
  PaginatedRequest,
  PaginatedResponse,
} from "@/modules/common/domain/pagination";

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

export type GetSeasonResponse = Season;
export type GetSeasonsRequest = PaginatedRequest<{
  status: SeasonStatus;
}>;
export type GetSeasonsResponse = PaginatedResponse<Season>;
