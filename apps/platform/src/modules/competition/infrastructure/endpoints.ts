export const competitionEndpoints = {
  getCompetition: (crunchAddress: string) =>
    `/v1/competitions/onchain:${crunchAddress}`,
};
