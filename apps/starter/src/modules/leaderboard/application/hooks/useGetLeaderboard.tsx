"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { initialSettings } from "@/modules/settings/domain/initial-config";
import { getLeaderboard, getModelList } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const { settings } = useGlobalSettings();

  const leaderboardQuery = useQuery({
    queryKey: ["leaderboard", settings?.endpoints?.leaderboard],
    queryFn: async () => {
      const endpoint = settings?.endpoints?.leaderboard || initialSettings.endpoints.leaderboard;
      return getLeaderboard(endpoint);
    },
    enabled: !!settings,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const modelsQuery = useQuery({
    queryKey: ["modelList", settings?.endpoints?.models],
    queryFn: async () => {
      const endpoint = settings?.endpoints?.models || initialSettings.endpoints.models;
      return getModelList(endpoint);
    },
    enabled: !!settings,
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
