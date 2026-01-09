import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useStakingContext } from "../context/stakingContext";

export const useGetStakingInfo = () => {
  const { publicKey } = useWallet();
  const { stakingClient } = useStakingContext();

  const query = useQuery({
    queryKey: ["staking-info", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !stakingClient) {
        return {
          stakedAmount: BigInt(0),
          availableToStake: BigInt(0),
          stakingAmounts: new Map(),
        };
      }

      try {
        const availableToStake = await stakingClient.getAvailableAmountToStake();
        const stakingAmounts = await stakingClient.getUserStakingAmountPerCoordinator();
        const selfStakedAmount = stakingAmounts.get(publicKey.toString()) || BigInt(0);

        return {
          stakedAmount: selfStakedAmount,
          availableToStake,
          stakingAmounts,
        };
      } catch (error) {
        console.error("Error fetching staking info:", error);
        return {
          stakedAmount: BigInt(0),
          availableToStake: BigInt(0),
          stakingAmounts: new Map(),
        };
      }
    },
    enabled: !!publicKey && !!stakingClient,
    refetchInterval: 60_000,
  });

  return {
    stakingInfo: query.data,
    stakingInfoLoading: query.isLoading,
    stakingInfoError: query.error,
    refetchStakingInfo: query.refetch,
  };
};