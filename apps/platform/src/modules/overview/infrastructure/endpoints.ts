export const overviewEndpoints = {
  slices: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}/slices`,
  slice: (competitionIdentifier: string, sliceName: string) =>
    `/v1/competitions/${competitionIdentifier}/slices/${sliceName}`,
};
