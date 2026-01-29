import configApiClient from "@coordinator/utils/src/config-api";
import { LeaderboardColumn } from "../domain/types";
import { endpoints } from "./endpoints";

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
