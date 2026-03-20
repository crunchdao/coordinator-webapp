"use client";
import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMultisig } from "@crunchdao/solana-utils";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { getConfig } from "@/config";
import "@solana/wallet-adapter-react-ui/styles.css";

/**
 * Unified wallet hook that merges Solana wallet-adapter with
 * the multisig context from @crunchdao/solana-utils (single source of truth).
 */
export const useWallet = () => {
  const multisig = useMultisig();

  try {
    const solana = useSolanaWallet();
    return { ...solana, ...multisig };
  } catch {
    return {
      publicKey: null,
      connected: false,
      connecting: false,
      disconnect: async () => {},
      connect: async () => {},
      select: () => {},
      wallet: null,
      wallets: [],
      signTransaction: async () => {
        throw new Error("Not available");
      },
      signAllTransactions: async () => {
        throw new Error("Not available");
      },
      signMessage: async () => {
        throw new Error("Not available");
      },
      ...multisig,
    };
  }
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const { solana } = getConfig();
  const network = solana.network;

  const endpoint = useMemo(() => {
    try {
      return solana.rpcUrl;
    } catch (error) {
      console.warn("Using default cluster URL:", error);
      return clusterApiUrl(network);
    }
  }, [solana.rpcUrl, network]);

  const wallets = useMemo(() => [new LedgerWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
