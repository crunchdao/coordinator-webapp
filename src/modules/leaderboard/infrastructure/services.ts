import apiClient from "@/utils/api";
import configApiClient from "@/utils/config-api";
import { Leaderboard, LeaderboardColumn } from "../domain/types";
import { endpoints } from "./endpoints";

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const response = await apiClient.get(endpoints.getLeaderboard());
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
