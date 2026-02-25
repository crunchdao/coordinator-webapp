"use client";

import { useQuery } from "@tanstack/react-query";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import {
  getCoordinatorPoolProgram,
  getCoordinatorPoolConfig,
} from "@crunchdao/sdk";
import { convertToCrunch } from "@crunchdao/solana-utils";

export interface CoordinatorPoolConfigData {
  minActivationSelfStake: number;
  minActiveStake: number;
  maxEffectiveStake: number;
}

export const useGetCoordinatorPoolConfig = () => {
  const { anchorProvider } = useAnchorProvider();

  const query = useQuery({
    queryKey: ["coordinator-pool-config"],
    queryFn: async (): Promise<CoordinatorPoolConfigData> => {
      if (!anchorProvider) {
        throw new Error("Anchor provider not available");
      }

      const coordinatorPoolProgram = getCoordinatorPoolProgram(anchorProvider);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = await getCoordinatorPoolConfig(
        coordinatorPoolProgram as any
      );

      return {
        minActivationSelfStake: convertToCrunch(
          Number(config.coordinatorMinActivationSelfstake)
        ),
        minActiveStake: convertToCrunch(
          Number(config.coordinatorMinActiveStake)
        ),
        maxEffectiveStake: convertToCrunch(
          Number(config.coordinatorMaxEffectiveStake)
        ),
      };
    },
    enabled: !!anchorProvider,
  });

  return {
    poolConfig: query.data,
    poolConfigLoading: query.isLoading,
    poolConfigError: query.error,
  };
};
