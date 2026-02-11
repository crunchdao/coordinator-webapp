import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

interface SolanaConfig {
  network: WalletAdapterNetwork;
  rpcUrl: string;
}

export type Environment = "staging" | "production";

export interface PlatformConfig {
  env: Environment;
  solana: SolanaConfig;
  cpiBaseUrl: string;
}

const getSolanaNetwork = (): WalletAdapterNetwork => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  switch (network) {
    case "mainnet-beta":
    case "mainnet":
      return WalletAdapterNetwork.Mainnet;
    case "devnet":
      return WalletAdapterNetwork.Devnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
};

const getSolanaRpcUrl = (): string => {
  const customUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  if (customUrl) {
    try {
      new URL(customUrl);
      return customUrl;
    } catch {
      throw new Error(
        `Invalid SOLANA_RPC_URL format: ${customUrl}. Must be a valid URL.`
      );
    }
  }

  return "https://api.devnet.solana.com";
};

export const config: PlatformConfig = {
  env: process.env.NEXT_PUBLIC_API_URL?.endsWith("crunchdao.com")
    ? "production"
    : "staging",
  solana: {
    network: getSolanaNetwork(),
    rpcUrl: getSolanaRpcUrl(),
  },
  cpiBaseUrl: process.env.NEXT_PUBLIC_CPI_BASE_URL || "https://cpi.crunchdao.io",
};
