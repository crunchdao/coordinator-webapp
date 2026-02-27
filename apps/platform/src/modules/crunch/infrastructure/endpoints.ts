export const coordinatorEndpoints = {
  getCoordinators: () => "/coordinators",
  getCrunches: () => "/crunches",
  getCrunch: (address: string) => `/crunches/${address}`,
};
