import { useQuery } from "@tanstack/react-query";
import { getOrganizers } from "../../infrastructure/service";

export function useGetOrganizers() {
  const query = useQuery({
    queryKey: ["organizers", "member"],
    queryFn: () => getOrganizers({ member: true, page: 0, size: 100 }),
  });

  return {
    organizers: query.data?.content ?? [],
    organizersLoading: query.isPending,
  };
}
