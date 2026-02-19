"use client";

import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { getCoordinators } from "../../infrastructure/service";
import {
  CoordinatorStatus,
  CoordinatorData,
} from "@/modules/crunch/domain/types";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

const CPI_STATE_TO_STATUS: Record<string, CoordinatorStatus> = {
  Pending: CoordinatorStatus.PENDING,
  Approved: CoordinatorStatus.APPROVED,
  Rejected: CoordinatorStatus.REJECTED,
};

export const useGetCoordinator = () => {
  const { authority, isMultisigMode, ready } = useEffectiveAuthority();
  const { environment } = useEnvironment();

  const query = useQuery<CoordinatorData>({
    queryKey: ["coordinator", environment, authority?.toString(), isMultisigMode],
    queryFn: async (): Promise<CoordinatorData> => {
      if (!authority) {
        return { status: CoordinatorStatus.UNREGISTERED, address: null, data: null };
      }

      const coordinators = await getCoordinators({ owner: authority.toString() });

      if (coordinators.length === 0) {
        return { status: CoordinatorStatus.UNREGISTERED, address: null, data: null };
      }

      const cpi = coordinators[0];
      const status = CPI_STATE_TO_STATUS[cpi.state] ?? CoordinatorStatus.UNREGISTERED;

      return {
        status,
        address: cpi.address,
        data: {
          state: {
            ...(status === CoordinatorStatus.PENDING && { pending: {} }),
            ...(status === CoordinatorStatus.APPROVED && { approved: {} }),
            ...(status === CoordinatorStatus.REJECTED && { rejected: {} }),
          },
          owner: new PublicKey(cpi.owner),
          bump: 0,
          name: cpi.name,
        },
      };
    },
    enabled: !!authority && ready,
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
