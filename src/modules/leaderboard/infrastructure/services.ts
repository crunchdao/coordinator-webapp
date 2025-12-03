import apiClient from "@/utils/api";
import { Leaderboard, LeaderboardColumn } from "../domain/types";
import { endpoints } from "./endpoints";
import { columns } from "../domain/columns";

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const response = await apiClient.get(endpoints.getLeaderboard());
  return response.data;
};

export const getLeaderboardColumns = async (): Promise<LeaderboardColumn[]> => {
  return columns;
};
