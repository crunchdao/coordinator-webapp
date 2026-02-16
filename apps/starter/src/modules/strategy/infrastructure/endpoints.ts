export const endpoints = {
  getStrategies: () => "/strategies",
  getStrategy: (name: string) => `/strategies/${name}`,
  getStrategyTrades: (name: string, limit: number) =>
    `/strategies/${name}/trades?limit=${limit}`,
  getStrategyCandles: (name: string, interval: string, limit: number) =>
    `/strategies/${name}/candles?interval=${interval}&limit=${limit}`,
};
