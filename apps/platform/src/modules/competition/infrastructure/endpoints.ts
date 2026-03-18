export const competitionEndpoints = {
  getCompetition: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}`,
  updateCompetition: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}`,
};
