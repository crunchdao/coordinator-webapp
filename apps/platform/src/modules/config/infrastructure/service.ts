import apiClient from "@coordinator/utils/src/api";
import type {
  CompetitionEnvironments,
  ConfigDirectoryListing,
} from "../domain/types";
import { Competition } from "@/modules/competition/domain/types";

export async function readConfigFile<T>(path: string): Promise<T> {
  const response = await apiClient.get(`/config/${path}`);
  return response.data;
}

export async function writeConfigFile<T>(path: string, data: T): Promise<T> {
  const response = await apiClient.put(`/config/${path}`, data);
  return response.data;
}

export async function deleteConfigFile(path: string): Promise<void> {
  await apiClient.delete(`/config/${path}`);
}

export async function listConfigDir(
  path: string
): Promise<ConfigDirectoryListing> {
  const response = await apiClient.get(`/config/${path}`);
  return response.data;
}

export async function listCompetitions(): Promise<ConfigDirectoryListing> {
  return listConfigDir("crunches");
}

export async function getCompetitionEnvironments(
  slug: string
): Promise<CompetitionEnvironments> {
  return readConfigFile<CompetitionEnvironments>(
    `crunches/${slug}/environments.json`
  );
}

export async function saveCompetitionEnvironments(
  slug: string,
  data: CompetitionEnvironments
): Promise<CompetitionEnvironments> {
  return writeConfigFile(`crunches/${slug}/environments.json`, data);
}

export async function getCompetitionSettings(
  slug: string
): Promise<Competition> {
  return readConfigFile<Competition>(`crunches/${slug}/settings.json`);
}

export async function saveCompetitionSettings(
  slug: string,
  data: Competition
): Promise<Competition> {
  return writeConfigFile(`crunches/${slug}/settings.json`, data);
}

