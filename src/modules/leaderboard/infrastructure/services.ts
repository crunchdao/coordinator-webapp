import apiClient from "@/utils/api";
import configApiClient from "@/utils/config-api";
import {
  GetModelsResponse,
  Leaderboard,
  LeaderboardColumn,
} from "../domain/types";
import { endpoints } from "./endpoints";

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
  const response = await configApiClient.get(endpoints.getLeaderboardColumns());
  return response.data;
};

export const addLeaderboardColumn = async (
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const response = await configApiClient.post(
    endpoints.getLeaderboardColumns(),
    column
  );
  return response.data;
};

export const removeLeaderboardColumn = async (id: number): Promise<void> => {
  await configApiClient.delete(`${endpoints.getLeaderboardColumns()}/${id}`);
};

export const updateLeaderboardColumn = async (
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const response = await configApiClient.put(
    `${endpoints.getLeaderboardColumns()}/${id}`,
    column
  );
  return response.data;
};
export const resetLeaderboardColumns = async (): Promise<void> => {
  await configApiClient.post(`${endpoints.resetLeaderboardColumns()}`);
};
