import { config } from "@/config";

export const endpoints = {
  getModelStates: () => `${config.cpiBaseUrl}/models/states`,
};
