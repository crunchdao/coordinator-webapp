"use client";

import { useQuery } from "@tanstack/react-query";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getCrunchForNetwork } from "../../infrastructure/service";

export function useGetCrunchForNetwork(
  address?: string | null,
  network?: WalletAdapterNetwork | null
) {
  const query = useQuery({
    queryKey: ["crunch-for-network", address, network],
    queryFn: () => getCrunchForNetwork(address!, network!),
    enabled: !!address && !!network,
  });

  return {
    crunch: query.data ?? null,
    crunchLoading: query.isLoading,
    crunchError: query.error,
  };
}
