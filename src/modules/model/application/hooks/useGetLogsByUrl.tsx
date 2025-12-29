"use client";
import { useQuery } from "@tanstack/react-query";

const MODEL_ORCHESTRATOR_URL =
  process.env.NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR || "http://localhost:8001";

export function useGetLogsByUrl(url: string, enabled?: boolean) {
  const query = useQuery({
    queryKey: ["modelLogsUrl", url],
    queryFn: async () => {
      try {
        const proxyUrl = url.replace(MODEL_ORCHESTRATOR_URL, "/api");

        const urlWithParams = new URL(proxyUrl, window.location.origin);
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
