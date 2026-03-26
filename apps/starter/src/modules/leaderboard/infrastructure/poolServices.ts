import apiClient from "@/utils/api/apiClient";

export type PoolModelRanking = {
  rank: number;
  model_id: string;
  model_name: string;
  avg_brier: number;
  avg_pnl: number;
  events_scored: number;
};

export type PoolRanking = {
  pool: string;
  metric: string;
  rankings: PoolModelRanking[];
};

export type PoolsResponse = {
  pools: PoolRanking[];
};

export const getPoolRankings = async (): Promise<PoolsResponse> => {
  const response = await apiClient.get("/reports/pools");
  return response.data;
};
