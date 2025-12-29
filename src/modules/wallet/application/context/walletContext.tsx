"use client";
import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { config } from "@/utils/config";
import "@solana/wallet-adapter-react-ui/styles.css";

import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";

export const useWallet = () => {
  try {
    return useSolanaWallet();
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
    };
  }
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const { isLocal } = useSettings();

  const network = config.solana.network;

  const endpoint = useMemo(() => {
    try {
      return config.solana.rpcUrl;
    } catch (error) {
      console.warn("Using default cluster URL:", error);
      return clusterApiUrl(network);
    }
  }, [network]);

  const wallets = useMemo(() => [new LedgerWalletAdapter()], []);

  if (isLocal) {
    return (
      <ConnectionProvider endpoint={"http://localhost:8899"}>
        <SolanaWalletProvider wallets={[]} autoConnect={false}>
          {children}
        </SolanaWalletProvider>
      </ConnectionProvider>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
