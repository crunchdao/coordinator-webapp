export const pitchEndpoints = {
  pitches: (seasonNumber: number) => `/v1/seasons/${seasonNumber}/pitches`,
  pitch: (seasonNumber: number, pitchName: string) =>
    `/v1/seasons/${seasonNumber}/pitches/${pitchName}`,
  slices: (seasonNumber: number, competitionIdentifier: string) =>
    `/v1/seasons/${seasonNumber}/pitches/${competitionIdentifier}/slices`,
  slice: (
    seasonNumber: number,
    competitionIdentifier: string,
    sliceName: string
  ) =>
    `/v1/seasons/${seasonNumber}/pitches/${competitionIdentifier}/slices/${sliceName}`,
};
