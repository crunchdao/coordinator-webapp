"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { pullSettingsFromHub, saveCompetitionSettings } from "../../infrastructure/service";

export function usePullSettings(slug: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      hubBaseUrl,
      address,
    }: {
      hubBaseUrl: string;
      address: string;
    }) => {
      const settings = await pullSettingsFromHub(hubBaseUrl, address);
      await saveCompetitionSettings(slug, settings);
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["competitionSettings", slug],
      });
      toast({ title: "Settings pulled from Hub successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to pull settings",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  return {
    pullSettings: mutation.mutate,
    pullSettingsLoading: mutation.isPending,
  };
}
