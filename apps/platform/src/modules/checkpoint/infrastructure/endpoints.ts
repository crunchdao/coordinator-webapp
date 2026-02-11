const CPI_BASE_URL = "https://cpi.crunchdao.io";

export const endpoints = {
  getCheckpoints: () => `${CPI_BASE_URL}/checkpoints`,
  getCheckpoint: (address: string) => `${CPI_BASE_URL}/checkpoints/${address}`,
};
