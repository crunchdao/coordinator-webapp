import { config } from "@/config";

export const cpiEndpoints = {
  getCrunches: () => `${config.cpiBaseUrl}/crunches`,
  getCrunch: (address: string) => `${config.cpiBaseUrl}/crunches/${address}`,
};
