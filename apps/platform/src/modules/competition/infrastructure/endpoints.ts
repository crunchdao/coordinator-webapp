export const competitionEndpoints = {
  getCompetition: (crunchAddress: string) =>
    `/v1/competitions/onchain:${crunchAddress}`,
  updateCompetition: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}`,
};
