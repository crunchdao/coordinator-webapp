import { useQuery } from "@tanstack/react-query";
import { getOrganizerMembers } from "../../infrastructure/service";

export function useGetOrganizerMembers(organizerName: string | undefined) {
  const query = useQuery({
    queryKey: ["organizer-members", organizerName],
    queryFn: () =>
      getOrganizerMembers(organizerName!, { page: 0, size: 100 }),
    enabled: !!organizerName,
  });

  return {
    members: query.data?.content ?? [],
    membersLoading: query.isPending,
  };
}
