import { config } from "@/config";

export const coordinatorEndpoints = {
  getCoordinators: () => `${config.cpiBaseUrl}/coordinators`,
  getCrunches: () => `${config.cpiBaseUrl}/crunches`,
  getCrunch: (address: string) => `${config.cpiBaseUrl}/crunches/${address}`,
};
