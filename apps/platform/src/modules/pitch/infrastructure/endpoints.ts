export const pitchEndpoints = {
  slices: (seasonNumber: number, crunchAddress: string) =>
    `/v1/seasons/${seasonNumber}/pitches/onchain:${crunchAddress}/slices`,
  slice: (seasonNumber: number, crunchAddress: string, sliceName: string) =>
    `/v1/seasons/${seasonNumber}/pitches/onchain:${crunchAddress}/slices/${sliceName}`,
};
