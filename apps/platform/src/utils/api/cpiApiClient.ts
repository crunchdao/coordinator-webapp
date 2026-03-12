"use client";

import axios, { type AxiosInstance } from "axios";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { toast } from "@crunch-ui/core";
import { getConfig } from "@/config";
import { CPI_URLS } from "@/modules/config/domain/types";

function createCpiClient(baseURL?: string): AxiosInstance {
  const client = axios.create({
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    ...(baseURL ? { baseURL } : {}),
  });

  if (!baseURL) {
    client.interceptors.request.use((config) => {
      config.baseURL = getConfig().cpiBaseUrl;
      return config;
    });
  }

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.message) {
        error.message = `CPI API Error (${error.response?.status}): ${
          error.config?.method
        } ${error.config?.url} - ${
          error.response?.data?.message || "Unknown error"
        }`;
      }

      if (typeof window !== "undefined") {
        const description =
          error?.response?.data?.message ||
          "An error occurred. Please try again.";

        toast?.({
          title: "Oops!",
          description,
          variant: "destructive",
          duration: 5000,
        });
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/** Default CPI client — uses the global environment CPI URL. */
const cpiApiClient = createCpiClient();

const cpiClientsByNetwork: Partial<
  Record<WalletAdapterNetwork, AxiosInstance>
> = {};

/**
 * Get a CPI client for a specific Solana network.
 * Instances are cached per network.
 */
export function getCpiClientForNetwork(
  network: WalletAdapterNetwork
): AxiosInstance {
  const existing = cpiClientsByNetwork[network];
  if (existing) return existing;

  const baseURL = CPI_URLS[network];
  if (!baseURL) {
    throw new Error(`No CPI URL configured for network: ${network}`);
  }

  const client = createCpiClient(baseURL);
  cpiClientsByNetwork[network] = client;
  return client;
}

export default cpiApiClient;
