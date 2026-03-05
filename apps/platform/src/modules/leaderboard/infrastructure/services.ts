import apiClient from "@coordinator/utils/src/api";
import hubApiClient from "@/utils/api/hubApiClient";
import {
  Leaderboard,
  LeaderboardColumn,
} from "@coordinator/leaderboard/src/domain/types";
import { initialColumns } from "@coordinator/leaderboard/src/domain/initial-config";
import { endpoints } from "./endpoints";
import type {
  LeaderboardDefinition,
  UpdateLeaderboardDefinitionPayload,
} from "../domain/types";

export const getLeaderboard = async (
  crunchName: string
): Promise<Leaderboard> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/leaderboard`
  );
  return response.data;
};

export const getLocalLeaderboardColumns = async (
  slug: string
): Promise<LeaderboardColumn[]> => {
  try {
    const response = await apiClient.get(endpoints.localLeaderboardColumns(slug));
    return response.data;
  } catch (error) {
    if ((error as any)?.response?.status === 404) {
      await apiClient.put(
        endpoints.localLeaderboardColumns(slug),
        initialColumns
      );
      return initialColumns;
    }
    throw error;
  }
};

export const addLocalLeaderboardColumn = async (
  slug: string,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const columns = await getLocalLeaderboardColumns(slug);
  const newColumn: LeaderboardColumn = {
    ...column,
    id: Math.max(...columns.map((c) => c.id), 0) + 1,
  };
  const updated = [...columns, newColumn];
  await apiClient.put(endpoints.localLeaderboardColumns(slug), updated);
  return newColumn;
};

export const removeLocalLeaderboardColumn = async (
  slug: string,
  id: number
): Promise<void> => {
  const columns = await getLocalLeaderboardColumns(slug);
  const updated = columns.filter((c) => c.id !== id);
  await apiClient.put(endpoints.localLeaderboardColumns(slug), updated);
};

export const updateLocalLeaderboardColumn = async (
  slug: string,
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const columns = await getLocalLeaderboardColumns(slug);
  const index = columns.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Column not found");
  const updatedColumn: LeaderboardColumn = { ...column, id };
  columns[index] = updatedColumn;
  await apiClient.put(endpoints.localLeaderboardColumns(slug), columns);
  return updatedColumn;
};

export const resetLocalLeaderboardColumns = async (
  slug: string
): Promise<void> => {
  await apiClient.put(endpoints.localLeaderboardColumns(slug), initialColumns);
};

export const getLeaderboardDefinitions = async (
  competitionIdentifier: string,
  hubBaseUrl: string
): Promise<LeaderboardDefinition[]> => {
  const response = await hubApiClient.get(
    endpoints.getLeaderboardDefinitions(competitionIdentifier),
    { baseURL: hubBaseUrl }
  );
  return response.data;
};

export const getLeaderboardDefinition = async (
  competitionIdentifier: string,
  definitionIdentifier: string,
  hubBaseUrl: string
): Promise<LeaderboardDefinition> => {
  const response = await hubApiClient.get(
    endpoints.getLeaderboardDefinition(competitionIdentifier, definitionIdentifier),
    { baseURL: hubBaseUrl }
  );
  return response.data;
};

export const updateLeaderboardDefinition = async (
  competitionIdentifier: string,
  definitionIdentifier: string,
  data: UpdateLeaderboardDefinitionPayload,
  hubBaseUrl: string
): Promise<LeaderboardDefinition> => {
  const response = await hubApiClient.patch(
    endpoints.updateLeaderboardDefinitions(competitionIdentifier, definitionIdentifier),
    data,
    { baseURL: hubBaseUrl }
  );
  return response.data;
};
