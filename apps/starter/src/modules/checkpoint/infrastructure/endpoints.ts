export const endpoints = {
  getCheckpoints: () => "/reports/checkpoints",
  getCheckpoint: (id: string) => `/reports/checkpoints/${id}`,
  getCheckpointPrizes: (id: string) => `/reports/checkpoints/${id}/prizes`,
  getCheckpointEmission: (id: string) => `/reports/checkpoints/${id}/emission`,
};
