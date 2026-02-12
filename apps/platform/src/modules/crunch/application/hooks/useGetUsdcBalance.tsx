import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import {
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import { getNetworkConstants } from "@crunchdao/sdk";
import { getConfig } from "@/config";

export const useGetUsdcBalance = () => {
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["usdc-balance", authority?.toString()],
    queryFn: async () => {
      if (!authority || !connection) {
        return 0;
      }

      const { solana } = getConfig();
      const network = solana.cluster === "mainnet-beta" ? "mainnet" : "devnet";
      const { USDC_TOKEN } = getNetworkConstants(network);

      const ataAddress = await getAssociatedTokenAddress(
        USDC_TOKEN,
        authority,
        isMultisigMode
      );

      try {
        const account = await getAccount(connection, ataAddress);
        return Number(account.amount) / 1_000_000;
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          return 0;
        }
        throw error;
      }
    },
    enabled: !!authority && !!connection,
    refetchInterval: 30_000,
  });

  return {
    usdcBalance: query.data ?? 0,
    usdcBalanceLoading: query.isLoading,
    usdcBalancePending: query.isPending,
    refetchUsdcBalance: query.refetch,
  };
};
