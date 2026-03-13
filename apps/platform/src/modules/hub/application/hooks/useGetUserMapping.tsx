import { useQuery } from "@tanstack/react-query";
import { getUsersMapping } from "../../infrastructure/service";

export function useGetUserMapping() {
  const query = useQuery({
    queryKey: ["userMapping"],
    queryFn: () => getUsersMapping(),
  });

  return {
    userMapping: query.data,
    userMappingLoading: query.isPending,
  };
}
