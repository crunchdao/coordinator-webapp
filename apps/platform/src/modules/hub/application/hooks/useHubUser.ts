import { useQuery } from "@tanstack/react-query";
import hubApiClient from "@/utils/api/hubApiClient";
import { HubUser } from "../../domain/types";

export const useHubUser = (token: string | null) => {
  const query = useQuery<HubUser>({
    queryKey: ["hub-user", token],
    queryFn: async () => {
      const response = await hubApiClient.get("/v2/users/@me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
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
