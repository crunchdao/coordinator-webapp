import { useQuery } from "@tanstack/react-query";
import { HubUser } from "../../domain/types";
import { getHubMe } from "../../infrastructure/service";

export const useHubUser = (token: string | null) => {
  const query = useQuery<HubUser>({
    queryKey: ["hub-user", token],
    queryFn: getHubMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    hubUser: query.data,
    hubUserLoading: query.isLoading,
    hubUserError: query.error,
  };
};
