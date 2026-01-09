import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useStakingContext } from "@/modules/staking/application/context/stakingContext";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { formatCrunchValue, convertToCrunch } from "@/utils/solana";

export const useGetCrnchBalance = () => {
  const { publicKey } = useWallet();
  const provider = useAnchorProvider();
  const { stakingClient } = useStakingContext();

  const query = useQuery({
    queryKey: ["wallet-balance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !provider || !stakingClient) {
        return {
          balance: 0,
          formatted: "0",
        };
      }

      try {
        const stakingConfig = await stakingClient.getStakingConfig();
        const tokenAccount = await getAssociatedTokenAddress(
          stakingConfig.crnchMint,
          publicKey
        );
        
        const accountInfo = await getAccount(provider.connection, tokenAccount);
        const balanceInDecimals = Number(accountInfo.amount.toString());
        const balance = convertToCrunch(balanceInDecimals);
        
        return {
          balance,
          formatted: formatCrunchValue(balance),
        };
      } catch (error) {
        console.warn("Error fetching CRNCH balance:", error);
        return {
          balance: 0,
          formatted: "0",
        };
      }
    },
    enabled: !!publicKey && !!provider && !!stakingClient,
    refetchInterval: 30_000,
  });

  return {
    crnchBalance: query.data,
    crnchBalanceLoading: query.isLoading,
    refetchCrnchBalance: query.refetch,
  };
};