import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import { getNetworkConstants } from "@crunchdao/sdk";

const getNetwork = () => {
  return process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
    ? "mainnet"
    : "devnet";
};

export const useGetUsdcBalance = () => {
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["usdc-balance", authority?.toString()],
    queryFn: async () => {
      if (!authority || !connection) {
        return 0;
      }

      const network = getNetwork();
      const { USDC_TOKEN } = getNetworkConstants(network);

      const ataAddress = await getAssociatedTokenAddress(
        USDC_TOKEN,
        authority,
        isMultisigMode // allowOwnerOffCurve for multisig vault PDA
      );

      try {
        const account = await getAccount(connection, ataAddress);
        // Convert from micro-USDC (6 decimals) to USDC
        return Number(account.amount) / 1_000_000;
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          return 0;
        }
        throw error;
      }
    },
    enabled: !!authority && !!connection,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    usdcBalance: query.data ?? 0,
    usdcBalanceLoading: query.isLoading,
    usdcBalancePending: query.isPending,
    refetchUsdcBalance: query.refetch,
  };
};
