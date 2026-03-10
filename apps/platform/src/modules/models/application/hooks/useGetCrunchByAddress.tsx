"use client";

import { useQuery } from "@tanstack/react-query";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getCrunchByAddress } from "../../infrastructure/service";

export function useGetCrunchByAddress(
  address?: string | null,
  network?: WalletAdapterNetwork | null
) {
  const query = useQuery({
    queryKey: ["crunch-by-address", address, network],
    queryFn: () => getCrunchByAddress(address!, network!),
    enabled: !!address && !!network,
  });

  return {
    crunch: query.data ?? null,
    crunchLoading: query.isLoading,
    crunchError: query.error,
  };
}
