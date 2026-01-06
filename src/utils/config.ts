import packageJson from "../../package.json";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export type Environment = "local" | "staging" | "production" | "development";

interface Config {
  env: Environment;
  version: string;
  solana: {
    network: WalletAdapterNetwork;
    rpcUrl: string;
  };
}

const getEnvironment = (): Environment => {
  console.log(process.env.VERCEL_ENV);
  if (process.env.VERCEL_ENV) {
    if (
      process.env.VERCEL_ENV === "production" &&
      process.env.VERCEL_GIT_COMMIT_REF === "master"
    ) {
      return "production";
    }
    return "staging";
  }
  if (process.env.NODE_ENV === "development") {
    return "development";
  }
  return "local";
};

const getSolanaNetwork = (): WalletAdapterNetwork => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

  switch (network) {
    case "devnet":
      return WalletAdapterNetwork.Devnet;
    case "testnet":
      return WalletAdapterNetwork.Testnet;
    case "mainnet-beta":
    case "mainnet":
      return WalletAdapterNetwork.Mainnet;
    default:
      const env = getEnvironment();
      return env === "production"
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet;
  }
};

const getSolanaRpcUrl = (): string => {
  const customUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  if (customUrl) {
    try {
      new URL(customUrl);
      return customUrl;
    } catch (error) {
      throw new Error(
        `Invalid SOLANA_RPC_URL format: ${customUrl}. Must be a valid URL.`
      );
    }
  }

  const env = getEnvironment();
  if (env !== "local" && env !== "development") {
    throw new Error(
      "NEXT_PUBLIC_SOLANA_RPC_URL must be set in production/staging/development environments"
    );
  }

  return "https://api.devnet.solana.com";
};

export const config: Config = {
  env: getEnvironment(),
  version: packageJson.version,
  solana: {
    network: getSolanaNetwork(),
    rpcUrl: getSolanaRpcUrl(),
  },
} as const;
