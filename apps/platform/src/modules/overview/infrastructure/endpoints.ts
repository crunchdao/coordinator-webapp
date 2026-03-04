export const overviewEndpoints = {
  slices: (crunchAddress: string) =>
    `/v1/competitions/onchain:${crunchAddress}/slices`,
  slice: (crunchAddress: string, sliceName: string) =>
    `/v1/competitions/onchain:${crunchAddress}/slices/${sliceName}`,
};
