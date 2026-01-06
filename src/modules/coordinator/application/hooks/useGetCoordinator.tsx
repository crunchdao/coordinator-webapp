import { useQuery } from "@tanstack/react-query";
import { getCoordinatorProgram, getCoordinator } from "@crunchdao/sdk";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import {
  CoordinatorStatus,
  CoordinatorData,
} from "@/modules/coordinator/domain/types";

export const useGetCoordinator = (): {
  coordinator: CoordinatorData | undefined;
  coordinatorLoading: boolean;
} => {
  const { publicKey } = useWallet();
  const provider = useAnchorProvider();

  const query = useQuery<CoordinatorData>({
    queryKey: ["coordinator", publicKey?.toString()],
    queryFn: async (): Promise<CoordinatorData> => {
      if (!publicKey || !provider) {
        return {
          status: CoordinatorStatus.UNREGISTERED,
          data: null,
        };
      }

      try {
        const coordinatorProgram = getCoordinatorProgram(provider);
        const coordinator = await getCoordinator(
          coordinatorProgram,
          new PublicKey(publicKey)
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
    enabled: !!publicKey && !!provider,
    refetchInterval: (query) => {
      if (query.state.data?.status === CoordinatorStatus.PENDING) {
        return 30_000;
      }
      return false;
    },
  });

  console.log(query.data);

  return {
    coordinator: query.data,
    coordinatorLoading: query.isLoading,
  };
};
