import { config } from "@/config";

export const endpoints = {
  getCheckpoints: () => `${config.cpiBaseUrl}/checkpoints`,
  getCheckpoint: (address: string) =>
    `${config.cpiBaseUrl}/checkpoints/${address}`,
};
