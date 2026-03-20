"use client";
import { useAnchorProvider as useAnchorProviderBase } from "@crunchdao/solana-utils";
import { useWallet } from "../context/walletContext";
import { useWalletAdapter } from "./useWalletAdapter";

export const useAnchorProvider = () => {
  const { walletAdapter, connection } = useWalletAdapter();
  const { connected } = useWallet();

  return useAnchorProviderBase({
    connection,
    wallet: walletAdapter,
    ready: connected,
  });
};
