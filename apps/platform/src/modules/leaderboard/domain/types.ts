import type { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";

export type LeaderboardDefinitionVisibility = "HIDDEN" | "PUBLIC";

export type LeaderboardDefinitionLayout = {
  hideTeam: boolean;
  hideProgress: boolean;
  hideBest: boolean;
  hideCrunchStartEnd: boolean;
  hideRoundChange: boolean;
  hidePhaseChange: boolean;
  hideCrunchChange: boolean;
  hideCommittedRewards: boolean;
  hideProjectedRewards: boolean;
};

export type LeaderboardDefinitionColumn = LeaderboardColumn & {
  default: boolean;
};

export type LeaderboardDefinition = {
  id: number;
  name: string;
  displayName: string;
  visibility: LeaderboardDefinitionVisibility;
  layout: LeaderboardDefinitionLayout;
  columns: LeaderboardDefinitionColumn[];
};

export type UpdateLeaderboardDefinitionPayload = {
  externalUrl?: string;
  columns: Omit<LeaderboardDefinitionColumn, "id" | "default">[];
};
