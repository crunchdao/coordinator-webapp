"use client";
import { useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import type { WalletAdapter } from "@crunchdao/solana-utils";
import { useWallet } from "../context/walletContext";

/**
 * Bridge hook: adapts @solana/wallet-adapter-react's wallet
 * to the WalletAdapter interface expected by @crunchdao/solana-utils
 */
export function useWalletAdapter() {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const walletAdapter: WalletAdapter | null = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null;
    return { publicKey, signTransaction, signAllTransactions };
  }, [publicKey, signTransaction, signAllTransactions]);

  return { walletAdapter, connection };
}
