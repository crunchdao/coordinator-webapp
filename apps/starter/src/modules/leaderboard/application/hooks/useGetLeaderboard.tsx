"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getLeaderboard, getModelList } from "../../infrastructure/services";

const DEFAULT_LEADERBOARD_ENDPOINT = "/reports/leaderboard";
const DEFAULT_MODELS_ENDPOINT = "/reports/models";

export function useGetLeaderboard() {
  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard", DEFAULT_LEADERBOARD_ENDPOINT],
    queryFn: () => getLeaderboard(DEFAULT_LEADERBOARD_ENDPOINT),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const modelsQuery = useQuery({
    queryKey: ["modelList", DEFAULT_MODELS_ENDPOINT],
    queryFn: () => getModelList(DEFAULT_MODELS_ENDPOINT),
  });

  const leaderboard = useMemo(() => {
    if (!leaderboardQuery.data) return [];

    const models = modelsQuery.data || [];
    type ModelInfo = { cruncher_name: string; model_name: string };
    const modelIdToInfo: Record<string, ModelInfo> = {};
    for (const model of models) {
      if (model.model_id) {
        modelIdToInfo[String(model.model_id)] = {
          cruncher_name: model.cruncher_name,
          model_name: model.model_name,
        };
      }
    }

    return leaderboardQuery.data.map((item) => {
      const modelInfo = item.model_id
        ? modelIdToInfo[String(item.model_id)]
        : null;
      return {
        ...item,
        cruncher_name: modelInfo?.cruncher_name || "",
        model_name: modelInfo?.model_name || "",
      };
    });
  }, [leaderboardQuery.data, modelsQuery.data]);

  return {
    leaderboard,
    leaderboardLoading: leaderboardQuery.isLoading || leaderboardQuery.isFetching || modelsQuery.isLoading,
  };
}
