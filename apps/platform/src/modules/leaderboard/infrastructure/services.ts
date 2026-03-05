import apiClient from "@coordinator/utils/src/api";
import { AxiosError } from "axios";
import hubApiClient from "@/utils/api/hubApiClient";
import {
  Leaderboard,
  LeaderboardColumn,
} from "@coordinator/leaderboard/src/domain/types";
import { initialColumns } from "@coordinator/leaderboard/src/domain/initial-config";
import { endpoints } from "./endpoints";
import type {
  LocalLeaderboardConfig,
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

export const getLocalLeaderboardConfig = async (
  slug: string
): Promise<LocalLeaderboardConfig> => {
  try {
    const response = await apiClient.get(
      endpoints.localLeaderboardColumns(slug)
    );
    // Backward compatibility: if the stored data is an array (old format), wrap it
    if (Array.isArray(response.data)) {
      return { externalUrl: null, columns: response.data };
    }
    return response.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      const defaultConfig: LocalLeaderboardConfig = {
        externalUrl: null,
        columns: initialColumns,
      };
      await apiClient.put(
        endpoints.localLeaderboardColumns(slug),
        defaultConfig
      );
      return defaultConfig;
    }
    throw error;
  }
};

export const saveLocalLeaderboardConfig = async (
  slug: string,
  config: LocalLeaderboardConfig
): Promise<void> => {
  await apiClient.put(endpoints.localLeaderboardColumns(slug), config);
};

export const addLocalLeaderboardColumn = async (
  slug: string,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const config = await getLocalLeaderboardConfig(slug);
  const newColumn: LeaderboardColumn = {
    ...column,
    id: Math.max(...config.columns.map((c) => c.id), 0) + 1,
  };
  await saveLocalLeaderboardConfig(slug, {
    ...config,
    columns: [...config.columns, newColumn],
  });
  return newColumn;
};

export const removeLocalLeaderboardColumn = async (
  slug: string,
  id: number
): Promise<void> => {
  const config = await getLocalLeaderboardConfig(slug);
  await saveLocalLeaderboardConfig(slug, {
    ...config,
    columns: config.columns.filter((c) => c.id !== id),
  });
};

export const updateLocalLeaderboardColumn = async (
  slug: string,
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const config = await getLocalLeaderboardConfig(slug);
  const index = config.columns.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Column not found");
  const updatedColumn: LeaderboardColumn = { ...column, id };
  config.columns[index] = updatedColumn;
  await saveLocalLeaderboardConfig(slug, config);
  return updatedColumn;
};

export const resetLocalLeaderboardColumns = async (
  slug: string
): Promise<void> => {
  await saveLocalLeaderboardConfig(slug, {
    externalUrl: null,
    columns: initialColumns,
  });
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
    endpoints.getLeaderboardDefinition(
      competitionIdentifier,
      definitionIdentifier
    ),
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
    endpoints.updateLeaderboardDefinitions(
      competitionIdentifier,
      definitionIdentifier
    ),
    data,
    { baseURL: hubBaseUrl }
  );
  return response.data;
};
