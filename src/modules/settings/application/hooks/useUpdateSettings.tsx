import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { updateGlobalSettings } from "../../infrastructure/services";
import { GlobalSettings } from "../../domain/types";
import { updateApiBaseUrl } from "@/utils/api";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (settings: GlobalSettings) => updateGlobalSettings(settings),
    onSuccess: (data) => {
      updateApiBaseUrl(data.apiBaseUrl);
      queryClient.invalidateQueries({ queryKey: ["globalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast({ title: "Settings updated successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  return {
    updateSettings: mutation.mutate,
    updateSettingsLoading: mutation.isPending,
  };
};