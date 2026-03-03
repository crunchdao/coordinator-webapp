import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export interface EnvironmentTarget {
  address: string;
  network: WalletAdapterNetwork;
  rpcUrl?: string;
  hubUrl?: string;
}

export type CompetitionEnvironments = Record<string, EnvironmentTarget>;

export interface ConfigDirectoryEntry {
  name: string;
  type: "file" | "directory";
}

export interface ConfigDirectoryListing {
  type: "directory";
  entries: ConfigDirectoryEntry[];
}

export const CPI_URLS: Partial<Record<WalletAdapterNetwork, string>> = {
  [WalletAdapterNetwork.Devnet]: "https://cpi.crunchdao.io",
  [WalletAdapterNetwork.Mainnet]: "https://cpi.crunchdao.com",
};

export const HUB_URL_OPTIONS = [
  { label: "None", value: "" },
  { label: "Staging (.io)", value: "https://hub.crunchdao.io" },
  { label: "Production (.com)", value: "https://hub.crunchdao.com" },
] as const;

export const DEFAULT_HUB_URLS: Partial<Record<WalletAdapterNetwork, string>> = {
  [WalletAdapterNetwork.Devnet]: "https://hub.crunchdao.io",
  [WalletAdapterNetwork.Mainnet]: "https://hub.crunchdao.com",
};

export const DEFAULT_RPC_URLS: Partial<Record<WalletAdapterNetwork, string>> = {
  [WalletAdapterNetwork.Devnet]:
    "https://deni-o6ejfm-fast-devnet.helius-rpc.com",
  [WalletAdapterNetwork.Mainnet]:
    "https://jessica-ana80z-fast-mainnet.helius-rpc.com",
};
