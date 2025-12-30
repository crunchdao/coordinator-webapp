"use client";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { initialSettings } from "@/modules/settings/domain/initial-config";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const { settings } = useGlobalSettings();

  const query = useQuery({
    queryKey: ["leaderboard", settings?.endpoints?.leaderboard],
    queryFn: async () => {
      try {
        if (!settings?.endpoints?.leaderboard) {
          console.error("Leaderboard endpoint not found in settings");
          return getLeaderboard(initialSettings.endpoints.leaderboard);
        }
        return getLeaderboard(settings.endpoints.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
      }
    },
    enabled: !!settings,
    retry: false,
    refetchOnWindowFocus: false,
  });
  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
