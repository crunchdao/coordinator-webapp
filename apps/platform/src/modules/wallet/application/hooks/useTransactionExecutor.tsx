"use client";
import { useTransactionExecutor as useTransactionExecutorBase } from "@crunchdao/solana-utils";
import { useWalletAdapter } from "./useWalletAdapter";

/**
 * Wrapper that provides the wallet adapter context
 * to @crunchdao/solana-utils's useTransactionExecutor
 */
export const useTransactionExecutor = () => {
  const { walletAdapter, connection } = useWalletAdapter();
  return useTransactionExecutorBase({ connection, wallet: walletAdapter });
};
