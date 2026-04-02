import apiClient from "@/utils/api/apiClient";
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
