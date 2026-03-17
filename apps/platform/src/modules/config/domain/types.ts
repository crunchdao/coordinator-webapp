import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Environment as PlatformEnvironment } from "@/config";

export interface Environment {
  name: string;
  address: string;
  network: WalletAdapterNetwork;
  rpcUrl?: string;
  hubUrl?: string;
  hubEnv?: PlatformEnvironment;
  coordinatorNodeUrl?: string;
}

export type CompetitionEnvironments = Environment[];

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
  { label: "None", value: "", hubEnv: undefined },
  {
    label: "Staging (.io)",
    value: "/hub-staging",
    hubEnv: "staging" as PlatformEnvironment,
  },
  {
    label: "Production (.com)",
    value: "/hub-prod",
    hubEnv: "production" as PlatformEnvironment,
  },
] as const;

export function hubEnvFromUrl(
  hubUrl?: string
): PlatformEnvironment | undefined {
  return HUB_URL_OPTIONS.find((o) => o.value === hubUrl)?.hubEnv;
}

export const DEFAULT_HUB_URLS: Partial<Record<WalletAdapterNetwork, string>> = {
  [WalletAdapterNetwork.Devnet]: "/hub-staging",
  [WalletAdapterNetwork.Mainnet]: "/hub-prod",
};

export const DEFAULT_RPC_URLS: Partial<Record<WalletAdapterNetwork, string>> = {
  [WalletAdapterNetwork.Devnet]:
    "https://deni-o6ejfm-fast-devnet.helius-rpc.com",
  [WalletAdapterNetwork.Mainnet]:
    "https://jessica-ana80z-fast-mainnet.helius-rpc.com",
};
