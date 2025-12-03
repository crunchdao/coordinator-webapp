import apiClient from "@/utils/api";
import { Leaderboard, LeaderboardColumn } from "../domain/types";
import { endpoints } from "./endpoints";
import { initialColumns } from "../domain/initial-columns";

async function loadColumns(): Promise<LeaderboardColumn[]> {
  try {
    const response = await fetch("/api/leaderboard/columns");
    if (!response.ok) {
      throw new Error("Failed to load columns");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load columns from file:", error);
    throw error;
  }
}

async function saveColumns(columns: LeaderboardColumn[]): Promise<void> {
  try {
    const response = await fetch("/api/leaderboard/columns", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(columns),
    });
    if (!response.ok) {
      throw new Error("Failed to save columns");
    }
  } catch (error) {
    console.error("Failed to save columns to file:", error);
    throw error;
  }
}

export const getLeaderboard = async (): Promise<Leaderboard> => {
  const response = await apiClient.get(endpoints.getLeaderboard());
  return response.data;
};

export const getLeaderboardColumns = async (): Promise<LeaderboardColumn[]> => {
  return await loadColumns();
};

export const addLeaderboardColumn = async (
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const columns = await loadColumns();
  const newColumn: LeaderboardColumn = {
    ...column,
    id: Math.max(...columns.map(c => c.id), 0) + 1,
  };
  const updatedColumns = [...columns, newColumn];
  await saveColumns(updatedColumns);
  return newColumn;
};

export const removeLeaderboardColumn = async (
  id: number
): Promise<void> => {
  const columns = await loadColumns();
  const updatedColumns = columns.filter(col => col.id !== id);
  await saveColumns(updatedColumns);
};

export const updateLeaderboardColumn = async (
  id: number,
  column: Omit<LeaderboardColumn, "id">
): Promise<LeaderboardColumn> => {
  const columns = await loadColumns();
  const index = columns.findIndex((col) => col.id === id);
  if (index === -1) {
    throw new Error("Column not found");
  }
  const updatedColumn: LeaderboardColumn = { ...column, id };
  const updatedColumns = [...columns];
  updatedColumns[index] = updatedColumn;
  await saveColumns(updatedColumns);
  return updatedColumn;
};

export const resetLeaderboardColumns = async (): Promise<void> => {
  await saveColumns([...initialColumns]);
};
