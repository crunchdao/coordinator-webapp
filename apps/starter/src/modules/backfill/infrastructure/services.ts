import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import {
  BackfillFeed,
  BackfillJob,
  BackfillFile,
  StartBackfillRequest,
} from "../domain/types";

export const getBackfillFeeds = async (): Promise<BackfillFeed[]> => {
  const response = await apiClient.get(endpoints.getBackfillFeeds());
  return response.data;
};

export const startBackfill = async (
  body: StartBackfillRequest
): Promise<BackfillJob> => {
  const response = await apiClient.post(endpoints.startBackfill(), body);
  return response.data;
};

export const getBackfillJobs = async (
  status?: string
): Promise<BackfillJob[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const response = await apiClient.get(endpoints.getBackfillJobs(), { params });
  return response.data;
};

export const getBackfillJob = async (id: string): Promise<BackfillJob> => {
  const response = await apiClient.get(endpoints.getBackfillJob(id));
  return response.data;
};

export const getBackfillIndex = async (): Promise<BackfillFile[]> => {
  const response = await apiClient.get(endpoints.getBackfillIndex());
  return response.data;
};
