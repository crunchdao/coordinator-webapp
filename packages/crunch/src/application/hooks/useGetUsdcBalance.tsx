import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@coordinator/wallet/src/application/context/walletContext";
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
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["usdc-balance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !connection) {
        return 0;
      }

      const network = getNetwork();
      const { USDC_TOKEN } = getNetworkConstants(network);

      const ataAddress = await getAssociatedTokenAddress(
        USDC_TOKEN,
        new PublicKey(publicKey)
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
    enabled: !!publicKey && !!connection,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    usdcBalance: query.data ?? 0,
    usdcBalanceLoading: query.isLoading,
    usdcBalancePending: query.isPending,
    refetchUsdcBalance: query.refetch,
  };
};
