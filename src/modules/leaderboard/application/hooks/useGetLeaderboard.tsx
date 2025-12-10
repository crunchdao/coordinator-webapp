"use client";
import { useQuery } from "@tanstack/react-query";
import { getGlobalSettings } from "@/modules/settings/infrastructure/services";
import { getLeaderboard } from "../../infrastructure/services";

export function useGetLeaderboard() {
  const query = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      try {
        const settings = await getGlobalSettings();
        if (!settings?.endpoints?.leaderboard) {
          console.error("Leaderboard endpoint not found in settings");
          return [];
        }
        return getLeaderboard(settings.endpoints.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  return {
    leaderboard: query.data || [],
    leaderboardLoading: query.isLoading || query.isFetching,
  };
}
