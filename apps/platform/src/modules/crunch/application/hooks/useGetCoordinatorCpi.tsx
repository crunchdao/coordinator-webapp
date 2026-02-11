"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoordinators } from "../../infrastructure/service";

export function useGetCoordinatorCpi(owner?: string) {
  const query = useQuery({
    queryKey: ["coordinators", owner],
    queryFn: async () => {
      const coordinators = await getCoordinators({ owner });
      return coordinators.length > 0 ? coordinators[0] : null;
    },
    enabled: !!owner,
  });

  return {
    coordinator: query.data ?? null,
    coordinatorLoading: query.isLoading,
    coordinatorError: query.error,
  };
}
