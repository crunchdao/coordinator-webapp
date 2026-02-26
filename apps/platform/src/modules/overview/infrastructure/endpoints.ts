import { config } from "@/config";

export const overviewEndpoints = {
  slices: (crunchName: string) =>
    `${config.hubApiBaseUrl}/v1/competitions/${crunchName}/slices`,
  slice: (crunchName: string, sliceName: string) =>
    `${config.hubApiBaseUrl}/v1/competitions/${crunchName}/slices/${sliceName}`,
};
