"use client";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorProvider as useAnchorProviderBase } from "@crunchdao/solana-utils";
import { useWallet } from "../context/walletContext";

export const useAnchorProvider = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useAnchorProviderBase({
    connection,
    wallet: wallet.publicKey && wallet.signTransaction && wallet.signAllTransactions
      ? {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        }
      : null,
    ready: wallet.connected,
  });
};
