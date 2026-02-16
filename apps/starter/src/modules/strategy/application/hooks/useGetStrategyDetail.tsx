"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getStrategy,
  getStrategyTrades,
  getStrategyCandles,
} from "../../infrastructure/services";

export function useGetStrategyDetail(name: string) {
  const detailQuery = useQuery({
    queryKey: ["strategy-detail", name],
    queryFn: () => getStrategy(name),
    retry: false,
    refetchInterval: 30_000,
  });

  const tradesQuery = useQuery({
    queryKey: ["strategy-trades", name],
    queryFn: () => getStrategyTrades(name, 500),
    retry: false,
    refetchInterval: 30_000,
  });

  return {
    detail: detailQuery.data ?? null,
    detailLoading: detailQuery.isLoading,
    detailError: detailQuery.error,
    trades: tradesQuery.data ?? [],
    tradesLoading: tradesQuery.isLoading,
  };
}

export function useGetStrategyCandles(name: string, interval: string) {
  const limit = interval === "1d" ? 90 : 168;

  const query = useQuery({
    queryKey: ["strategy-candles", name, interval],
    queryFn: () => getStrategyCandles(name, interval, limit),
    retry: false,
  });

  return {
    candles: query.data ?? [],
    candlesLoading: query.isLoading,
  };
}
