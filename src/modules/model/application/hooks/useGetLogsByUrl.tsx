"use client";
import { useQuery } from "@tanstack/react-query";

export function useGetLogsByUrl(url: string, enabled?: boolean) {
  const query = useQuery({
    queryKey: ["modelLogsUrl", url],
    queryFn: async () => {
      try {
        const urlWithParams = new URL(url);
        if (!urlWithParams.searchParams.has("follow")) {
          urlWithParams.searchParams.set("follow", "false");
        }
        if (!urlWithParams.searchParams.has("from_start")) {
          urlWithParams.searchParams.set("from_start", "true");
        }

        const response = await fetch(urlWithParams.toString());
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        console.error("Error fetching logs:", error);
        throw error;
      }
    },
    enabled: enabled && !!url,
    refetchInterval: 5000,
    retry: 0,
  });

  return {
    logs: query.data || "",
    logsLoading: query.isLoading,
    logsError: query.error,
  };
}
