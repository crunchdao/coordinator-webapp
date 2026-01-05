import { useQuery } from "@tanstack/react-query";
import { getCoordinatorProgram, getCoordinator } from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { PublicKey } from "@solana/web3.js";
import {
  CoordinatorStatus,
  CoordinatorState,
} from "@/modules/coordinator/domain/types";

export const useGetCoordinator = () => {
  const { publicKey } = useWallet();
  const provider = useAnchorProvider();

  const query = useQuery({
    queryKey: ["coordinator", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !provider) {
        return null;
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
        console.error("Error fetching coordinator:", error);
        return {
          status: CoordinatorStatus.UNREGISTERED,
          data: null,
        };
      }
    },
    enabled: !!publicKey && !!provider,
  });

  return {
    coordinator: query.data,
    coordinatorLoading: query.isLoading,
  };
};
