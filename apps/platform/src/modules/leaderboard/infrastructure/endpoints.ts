export const endpoints = {
  localLeaderboardColumns: (slug: string) =>
    `/config/crunches/${slug}/leaderboard/columns.json`,
  getLeaderboardDefinitions: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}/leaderboard-definitions`,
  getLeaderboardDefinition: (
    competitionIdentifier: string,
    definitionIdentifier: string
  ) =>
    `/v1/competitions/${competitionIdentifier}/leaderboard-definitions/${definitionIdentifier}`,
  updateLeaderboardDefinitions: (
    competitionIdentifier: string,
    definitionIdentifier: string
  ) =>
    `/v1/competitions/${competitionIdentifier}/leaderboard-definitions/${definitionIdentifier}`,
};
