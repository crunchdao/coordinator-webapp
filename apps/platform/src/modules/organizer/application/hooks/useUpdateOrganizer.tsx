import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { updateOrganizer } from "../../infrastructure/service";
import type { OrganizerUpdateForm } from "../../domain/types";

export function useUpdateOrganizer(organizerName: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: OrganizerUpdateForm) =>
      updateOrganizer(organizerName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizer", organizerName],
      });
      toast({ title: "Organization updated" });
    },
    onError: () => {
      toast({
        title: "Failed to update organization",
        variant: "destructive",
      });
    },
  });

  return {
    updateOrganizer: mutation.mutateAsync,
    updateOrganizerLoading: mutation.isPending,
  };
}
