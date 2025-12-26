"use client";
import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { config } from "@/utils/config";
import "@solana/wallet-adapter-react-ui/styles.css";

export { useWallet } from "@solana/wallet-adapter-react";

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

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  if (isLocal) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
