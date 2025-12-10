import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { updateGlobalSettings } from "../../infrastructure/services";
import { GlobalSettings } from "../../domain/types";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (settings: GlobalSettings) => updateGlobalSettings(settings),
    onSuccess: () => {
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
