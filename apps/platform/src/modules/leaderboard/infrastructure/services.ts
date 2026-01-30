import apiClient from "@coordinator/utils/src/api";
import {
  Leaderboard,
  LeaderboardColumn,
} from "@coordinator/leaderboard/src/domain/types";
import { endpoints } from "./endpoints";

export const getLeaderboard = async (
  crunchName: string
): Promise<Leaderboard> => {
  const response = await apiClient.get(`/crunches/${crunchName}/reports/leaderboard`);
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
