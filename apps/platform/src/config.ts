import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Cookies from "js-cookie";

export type Environment = "staging" | "production";

export interface PlatformConfig {
  env: Environment;
  solana: {
    network: WalletAdapterNetwork;
    rpcUrl: string;
    cluster: "devnet" | "mainnet-beta";
  };
  hubBaseUrl: string;
  hubApiBaseUrl: string;
  cpiBaseUrl: string;
}

const configs: Record<Environment, PlatformConfig> = {
  staging: {
    env: "staging",
    solana: {
      network: WalletAdapterNetwork.Devnet,
      rpcUrl: "https://deni-o6ejfm-fast-devnet.helius-rpc.com",
      cluster: "devnet",
    },
    hubBaseUrl: "https://hub.crunchdao.io",
    hubApiBaseUrl: "https://api.hub.crunchdao.io",
    cpiBaseUrl: "https://cpi.crunchdao.io",
  },
  production: {
    env: "production",
    solana: {
      network: WalletAdapterNetwork.Mainnet,
      rpcUrl: "https://jessica-ana80z-fast-mainnet.helius-rpc.com",
      cluster: "mainnet-beta",
    },
    hubBaseUrl: "https://hub.crunchdao.com",
    hubApiBaseUrl: "https://api.hub.crunchdao.com",
    cpiBaseUrl: "https://cpi.crunchdao.com",
  },
};

const COOKIE_KEY = "coordinator-environment";
const DEFAULT_ENV: Environment = "staging";

function isValidEnvironment(value: unknown): value is Environment {
  return value === "staging" || value === "production";
}

/**
 * Read the current environment from cookie (or default).
 * Works both client-side and server-side (via cookie header).
 */
export function getEnvironment(): Environment {
  const stored = Cookies.get(COOKIE_KEY);
  if (isValidEnvironment(stored)) return stored;
  return DEFAULT_ENV;
}

export function setEnvironment(env: Environment): void {
  Cookies.set(COOKIE_KEY, env, { sameSite: "Lax", expires: 365 });
}

/**
 * Get the config for the current environment.
 * Works both inside and outside React (reads from cookie).
 */
export function getConfig(): PlatformConfig {
  return configs[getEnvironment()];
}

/**
 * Get the config for a specific environment.
 */
export function getConfigFor(env: Environment): PlatformConfig {
  return configs[env];
}

// Backwards-compatible default export — reads from cookie at access time.
// Use getConfig() in new code for clarity.
export const config: PlatformConfig = new Proxy({} as PlatformConfig, {
  get(_target, prop) {
    return getConfig()[prop as keyof PlatformConfig];
  },
});
