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

export async function listLocalCompetitions(): Promise<ConfigDirectoryListing> {
  return listConfigDir("crunches");
}

export async function getLocalCompetitionEnvironments(
  slug: string
): Promise<CompetitionEnvironments> {
  return readConfigFile<CompetitionEnvironments>(
    `crunches/${slug}/environments.json`
  );
}

export async function saveLocalCompetitionEnvironments(
  slug: string,
  data: CompetitionEnvironments
): Promise<CompetitionEnvironments> {
  return writeConfigFile(`crunches/${slug}/environments.json`, data);
}

export async function getLocalCompetitionSettings(
  slug: string
): Promise<Competition> {
  return readConfigFile<Competition>(`crunches/${slug}/settings.json`);
}

export async function saveLocalCompetitionSettings(
  slug: string,
  data: Competition
): Promise<Competition> {
  return writeConfigFile(`crunches/${slug}/settings.json`, data);
}

