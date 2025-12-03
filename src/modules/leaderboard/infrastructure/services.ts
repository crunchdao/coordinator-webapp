import apiClient from "@/utils/api";
import { Leaderboard, LeaderboardColumn } from "../domain/types";
import { endpoints } from "./endpoints";
import { initialColumns } from "../domain/initial-columns";

let columnsStore: LeaderboardColumn[] = [...initialColumns];

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const response = await apiClient.get(endpoints.getLeaderboard());
  return response.data;
};

export const getLeaderboardColumns = async (): Promise<LeaderboardColumn[]> => {
  return columnsStore;
};

export const addLeaderboardColumn = async (
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const newColumn: LeaderboardColumn = {
    ...column,
    id: Math.max(...columnsStore.map(c => c.id), 0) + 1,
  };
  columnsStore = [...columnsStore, newColumn];
  return newColumn;
};

export const removeLeaderboardColumn = async (
  id: number
): Promise<void> => {
  columnsStore = columnsStore.filter(col => col.id !== id);
};

export const updateLeaderboardColumn = async (
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const index = columnsStore.findIndex((col) => col.id === id);
  if (index === -1) {
    throw new Error("Column not found");
  }
  const updatedColumn: LeaderboardColumn = { ...column, id };
  columnsStore[index] = updatedColumn;
  return updatedColumn;
};
