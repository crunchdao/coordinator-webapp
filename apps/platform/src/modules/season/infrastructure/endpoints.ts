export const seasonEndpoints = {
  getSeasons: () => "/v1/seasons",
  getSeason: (seasonNumber: number | string) => `/v1/seasons/${seasonNumber}`,
};
