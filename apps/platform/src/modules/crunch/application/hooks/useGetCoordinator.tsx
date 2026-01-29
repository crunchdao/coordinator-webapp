import { useQuery } from "@tanstack/react-query";
import { getCoordinatorProgram, getCoordinator } from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import {
  CoordinatorStatus,
  CoordinatorData,
} from "@/modules/crunch/domain/types";

export const useGetCoordinator = (): {
  coordinator: CoordinatorData | undefined;
  coordinatorLoading: boolean;
  isMultisigMode: boolean;
} => {
  const { authority, isMultisigMode, ready } = useEffectiveAuthority();
  const { anchorProvider } = useAnchorProvider();

  const query = useQuery<CoordinatorData>({
    queryKey: ["coordinator", authority?.toString(), isMultisigMode],
    queryFn: async (): Promise<CoordinatorData> => {
      if (!authority || !anchorProvider) {
        return {
          status: CoordinatorStatus.UNREGISTERED,
          data: null,
        };
      }

      try {
        const coordinatorProgram = getCoordinatorProgram(anchorProvider);
        const coordinator = await getCoordinator(
          coordinatorProgram,
          authority
        );

        if (!coordinator) {
          return {
            status: CoordinatorStatus.UNREGISTERED,
            data: null,
          };
        }

        let status: CoordinatorStatus;
        if (coordinator.state.pending) {
          status = CoordinatorStatus.PENDING;
        } else if (coordinator.state.approved) {
          status = CoordinatorStatus.APPROVED;
        } else if (coordinator.state.rejected) {
          status = CoordinatorStatus.REJECTED;
        } else {
          status = CoordinatorStatus.UNREGISTERED;
        }

        return {
          status,
          data: coordinator,
        };
      } catch (error) {
        console.warn("Error fetching coordinator:", error);
        return {
          status: CoordinatorStatus.UNREGISTERED,
          data: null,
        };
      }
    },
    enabled: !!authority && !!anchorProvider && ready,
    refetchInterval: (query) => {
      if (query.state.data?.status === CoordinatorStatus.PENDING) {
        return 30_000;
      }
      return false;
    },
  });

  return {
    coordinator: query.data,
    coordinatorLoading: query.isLoading,
    isMultisigMode,
  };
};
