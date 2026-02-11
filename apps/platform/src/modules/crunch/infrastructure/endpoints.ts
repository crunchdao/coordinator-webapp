import { config } from "@/config";

export const cpiEndpoints = {
  getCoordinators: () => `${config.cpiBaseUrl}/coordinators`,
  getCrunches: () => `${config.cpiBaseUrl}/crunches`,
  getCrunch: (address: string) => `${config.cpiBaseUrl}/crunches/${address}`,
};
