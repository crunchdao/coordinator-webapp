export type CompetitionVisibility = "HIDDEN" | "PUBLIC";

export interface Competition {
  name: string;
  displayName: string;
  fullName: string;
  shortDescription: string;
  url: string;
  start: string;
  end: string;
  visibility: CompetitionVisibility;
  cardImageUrl: string;
  bannerImageUrl: string;
  documentationUrl: string;
  notebookUrl: string;
  advancedNotebookUrl: string;
  discussionUrl: string;
  codeUrl: string;
  ruleContentUrl: string;
  prizePoolText: string;
  prizePoolShortText: string;
  prizePoolUsd: number;
}
