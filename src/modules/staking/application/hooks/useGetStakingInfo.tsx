import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useStakingContext } from "../context/stakingContext";
import { convertToCrunch } from "@crunchdao/solana-utils";

export const useGetStakingInfo = () => {
  const { publicKey } = useWallet();
  const { stakingClient } = useStakingContext();

  const query = useQuery({
    queryKey: ["staking-info", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !stakingClient) {
        return {
          stakedAmount: 0,
          availableToStake: 0,
          stakingAmounts: new Map<string, number>(),
        };
      }

      try {
        const availableToStakeBigInt = await stakingClient.getAvailableAmountToStake();
        const availableToStake = convertToCrunch(Number(availableToStakeBigInt));
        
        const stakingAmountsBigInt = await stakingClient.getUserStakingAmountPerCoordinator();
        const selfStakedAmountBigInt = stakingAmountsBigInt.get(publicKey.toString()) || BigInt(0);
        const stakedAmount = convertToCrunch(Number(selfStakedAmountBigInt));
        
        // Convert all staking amounts to numbers
        const stakingAmounts = new Map<string, number>();
        for (const [key, value] of stakingAmountsBigInt.entries()) {
          stakingAmounts.set(key, convertToCrunch(Number(value)));
        }

        return {
          stakedAmount,
          availableToStake,
          stakingAmounts,
        };
      } catch (error) {
        console.error("Error fetching staking info:", error);
        return {
          stakedAmount: 0,
          availableToStake: 0,
          stakingAmounts: new Map<string, number>(),
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
