import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { NodeCheckpoint } from "../domain/types";

export const getCheckpoints = async (
  status?: string
): Promise<NodeCheckpoint[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const response = await apiClient.get(endpoints.getCheckpoints(), { params });
  return response.data;
};

export const getCheckpointPrizes = async (
  id: string,
  totalPrize?: number
): Promise<{ prizeId: string; timestamp: number; model: string; prize: number }[]> => {
  const params: Record<string, number> = {};
  if (totalPrize !== undefined) params.total_prize = totalPrize;
  const response = await apiClient.get(endpoints.getCheckpointPrizes(id), { params });
  return response.data;
};
