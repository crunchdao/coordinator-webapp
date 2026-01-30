import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAccount, TokenAccountNotFoundError } from "@solana/spl-token";

export const useGetRewardVaultBalance = (rewardVaultAddress: PublicKey) => {
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["reward-vault-balance", rewardVaultAddress.toString()],
    queryFn: async () => {
      if (!connection) {
        return 0;
      }

      try {
        const account = await getAccount(connection, rewardVaultAddress);
        // Convert from micro-USDC (6 decimals) to USDC
        return Number(account.amount) / 1_000_000;
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          return 0;
        }
        throw error;
      }
    },
    enabled: !!connection && !!rewardVaultAddress,
    refetchInterval: 30000,
  });

  return {
    vaultBalance: query.data ?? 0,
    vaultBalanceLoading: query.isLoading,
    refetchVaultBalance: query.refetch,
  };
};
