import { useQuery } from "@tanstack/react-query";
import { getOrganizer } from "../../infrastructure/service";

export function useGetOrganizer(organizerIdentifier: string | undefined) {
  const query = useQuery({
    queryKey: ["organizer", organizerIdentifier],
    queryFn: () => getOrganizer(organizerIdentifier as string),
    enabled: !!organizerIdentifier,
  });

  return {
    organizer: query.data,
    organizerLoading: query.isPending,
  };
}
