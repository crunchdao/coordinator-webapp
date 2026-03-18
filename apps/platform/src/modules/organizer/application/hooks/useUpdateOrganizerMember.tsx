import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { updateOrganizerMember } from "../../infrastructure/service";
import type { OrganizerMemberRole } from "../../domain/types";

export function useUpdateOrganizerMember(organizerName: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      userLogin,
      role,
    }: {
      userLogin: string;
      role: OrganizerMemberRole;
    }) => updateOrganizerMember(organizerName, userLogin, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizer-members", organizerName],
      });
      toast({ title: "Role updated" });
    },
    onError: () => {
      toast({ title: "Failed to update role", variant: "destructive" });
    },
  });

  return {
    updateOrganizerMember: mutation.mutate,
    updateOrganizerMemberLoading: mutation.isPending,
  };
}
