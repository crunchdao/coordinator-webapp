import { useQuery } from "@tanstack/react-query";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useStakingContext } from "@crunchdao/staking";
import { convertToCrunch } from "@crunchdao/solana-utils";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export const useGetStakingInfo = () => {
  const { authority } = useEffectiveAuthority();
  const { stakingClient } = useStakingContext();
  const { environment } = useEnvironment();

  const query = useQuery({
    queryKey: ["staking-info", environment, authority?.toString()],
    queryFn: async () => {
      if (!authority || !stakingClient) {
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
        const selfStakedAmountBigInt = stakingAmountsBigInt.get(authority.toString()) || BigInt(0);
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
    enabled: !!authority && !!stakingClient,
    refetchInterval: 60_000,
  });

  return {
    stakingInfo: query.data,
    stakingInfoLoading: query.isLoading,
    stakingInfoError: query.error,
    refetchStakingInfo: query.refetch,
  };
};
