import { useQuery } from "@tanstack/react-query";
import { convertToCrunch } from "@/utils/solana";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useStakingContext } from "../context/stakingContext";

export const useGetCrnchAccount = () => {
  const anchorProvider = useAnchorProvider();
  const wallet = anchorProvider?.wallet.publicKey;
  const { stakingClient } = useStakingContext();

  const query = useQuery({
    queryKey: ["staking", "crnchAccount", wallet?.toBase58()],
    queryFn: async () => {
      if (!stakingClient || !wallet) {
        return;
      }

      try {
        const userCrunchAta = await stakingClient.getUserCrnchATA();
        const amountInDecimals = convertToCrunch(Number(userCrunchAta.amount));

        return {
          ...userCrunchAta,
          amount: amountInDecimals,
        };
      } catch (error: unknown) {
        console.error("Error fetching staking balance:", error);
        throw error;
      }
    },
    enabled: !!wallet && !!stakingClient,
    retry: 1,
    refetchInterval: false,
  });

  return {
    crnchAccount: query.data,
    crnchAccountLoading: query.isLoading,
  };
};
