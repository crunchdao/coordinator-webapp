import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { addOrganizerMember } from "../../infrastructure/service";
import type { OrganizerMemberRole } from "../../domain/types";

export function useAddOrganizerMember(organizerName: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { userId: number; role: OrganizerMemberRole }) =>
      addOrganizerMember(organizerName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizer-members", organizerName],
      });
      toast({ title: "Member added" });
    },
    onError: () => {
      toast({ title: "Failed to add member", variant: "destructive" });
    },
  });

  return {
    addOrganizerMember: mutation.mutateAsync,
    addOrganizerMemberLoading: mutation.isPending,
  };
}
