import axios from "axios";
import {
  Leaderboard,
  LeaderboardColumn,
} from "@coordinator/leaderboard/src/domain/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLeaderboard = async (
  crunchName: string
): Promise<Leaderboard> => {
  const response = await apiClient.get(`/crunches/${crunchName}/reports/leaderboard`);
  return response.data;
};

export const getLeaderboardColumns = async (
  crunchName: string
): Promise<LeaderboardColumn[]> => {
  const response = await apiClient.get(`/crunches/${crunchName}/leaderboard/columns`);
  return response.data;
};
