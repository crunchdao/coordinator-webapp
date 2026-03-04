import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { Strategy, StrategyDetail, Trade, Candle } from "../domain/types";

export const getStrategies = async (): Promise<Strategy[]> => {
  const response = await apiClient.get(endpoints.getStrategies());
  return response.data;
};

export const getStrategy = async (name: string): Promise<StrategyDetail> => {
  const response = await apiClient.get(endpoints.getStrategy(name));
  return response.data;
};

export const getStrategyTrades = async (
  name: string,
  limit: number = 500
): Promise<Trade[]> => {
  const response = await apiClient.get(
    endpoints.getStrategyTrades(name, limit)
  );
  return response.data.trades || [];
};

export const getStrategyCandles = async (
  name: string,
  interval: string,
  limit: number
): Promise<Candle[]> => {
  const response = await apiClient.get(
    endpoints.getStrategyCandles(name, interval, limit)
  );
  return response.data;
};
