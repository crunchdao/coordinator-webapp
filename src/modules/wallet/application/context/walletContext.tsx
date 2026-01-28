"use client";
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { config } from "@/utils/config";
import "@solana/wallet-adapter-react-ui/styles.css";

import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";

const MULTISIG_STORAGE_KEY = "multisig-address";

const isValidPublicKey = (value: string): boolean => {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
};

const readMultisigFromStorage = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(MULTISIG_STORAGE_KEY) || "";
};

interface MultisigContextValue {
  multisigAddress: string;
  setMultisigAddress: (address: string) => boolean;
  clearMultisigAddress: () => void;
  isMultisigMode: boolean;
}

const MultisigContext = createContext<MultisigContextValue>({
  multisigAddress: "",
  setMultisigAddress: () => false,
  clearMultisigAddress: () => {},
  isMultisigMode: false,
});

export const useWallet = () => {
  const multisig = useContext(MultisigContext);

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
  const { isLocal } = useSettings();
  const [multisigAddress, setAddress] = useState<string>(readMultisigFromStorage);

  useEffect(() => {
    setAddress(readMultisigFromStorage());
  }, []);

  const setMultisigAddress = useCallback((address: string): boolean => {
    if (address && !isValidPublicKey(address)) {
      return false;
    }
    localStorage.setItem(MULTISIG_STORAGE_KEY, address);
    setAddress(address);
    return true;
  }, []);

  const clearMultisigAddress = useCallback(() => {
    localStorage.removeItem(MULTISIG_STORAGE_KEY);
    setAddress("");
  }, []);

  const multisigValue = useMemo(
    () => ({
      multisigAddress,
      setMultisigAddress,
      clearMultisigAddress,
      isMultisigMode: Boolean(multisigAddress),
    }),
    [multisigAddress, setMultisigAddress, clearMultisigAddress]
  );

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
      <MultisigContext.Provider value={multisigValue}>
        <ConnectionProvider endpoint={"http://localhost:8899"}>
          <SolanaWalletProvider wallets={[]} autoConnect={false}>
            {children}
          </SolanaWalletProvider>
        </ConnectionProvider>
      </MultisigContext.Provider>
    );
  }

  return (
    <MultisigContext.Provider value={multisigValue}>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </MultisigContext.Provider>
  );
};
