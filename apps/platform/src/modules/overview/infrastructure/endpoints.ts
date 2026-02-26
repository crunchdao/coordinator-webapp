export const overviewEndpoints = {
  slices: (crunchName: string) => `/v1/competitions/${crunchName}/slices`,
  slice: (crunchName: string, sliceName: string) =>
    `/v1/competitions/${crunchName}/slices/${sliceName}`,
};
