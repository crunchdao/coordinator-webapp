import apiClient from "@coordinator/utils/src/api";
import {
  Leaderboard,
  LeaderboardColumn,
} from "@coordinator/leaderboard/src/domain/types";
import { endpoints } from "./endpoints";

export type GetModelsResponse = {
  model_id: string;
  model_name: string;
  cruncher_name: string;
  cruncher_id: string;
  deployment_id: string;
}[];

export const getLeaderboard = async (
  leaderboardEndpoint: string
): Promise<Leaderboard> => {
  const response = await apiClient.get(leaderboardEndpoint);
  return response.data;
};

export const getModelList = async (
  modelListEndpoint: string
): Promise<GetModelsResponse> => {
  const response = await apiClient.get(modelListEndpoint);
  return response.data;
};

export const getLeaderboardColumns = async (): Promise<LeaderboardColumn[]> => {
  const response = await apiClient.get(endpoints.getLeaderboardColumns());
  return response.data;
};

export const addLeaderboardColumn = async (
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const response = await apiClient.post(
    endpoints.getLeaderboardColumns(),
    column
  );
  return response.data;
};

export const removeLeaderboardColumn = async (id: number): Promise<void> => {
  await apiClient.delete(`${endpoints.getLeaderboardColumns()}/${id}`);
};

export const updateLeaderboardColumn = async (
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const response = await apiClient.put(
    `${endpoints.getLeaderboardColumns()}/${id}`,
    column
  );
  return response.data;
};

export const resetLeaderboardColumns = async (): Promise<void> => {
  await apiClient.post(`${endpoints.resetLeaderboardColumns()}`);
};
