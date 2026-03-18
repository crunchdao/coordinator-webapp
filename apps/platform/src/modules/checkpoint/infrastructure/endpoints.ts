import { getConfig } from "@/config";

export const endpoints = {
  getCheckpoints: () => `${getConfig().cpiBaseUrl}/checkpoints`,
  getCheckpoint: (address: string) =>
    `${getConfig().cpiBaseUrl}/checkpoints/${address}`,
};
