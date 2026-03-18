import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { deleteOrganizerMember } from "../../infrastructure/service";

export function useDeleteOrganizerMember(organizerName: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userLogin: string) =>
      deleteOrganizerMember(organizerName, userLogin),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizer-members", organizerName],
      });
      toast({ title: "Member removed" });
    },
    onError: () => {
      toast({ title: "Failed to remove member", variant: "destructive" });
    },
  });

  return {
    deleteOrganizerMember: mutation.mutate,
    deleteOrganizerMemberLoading: mutation.isPending,
  };
}
