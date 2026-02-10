"use client";

import { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import {
  getCoordinatorProgram,
  CrunchAccountServiceWithContext,
  CrunchAccount,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";

interface CrunchContextValue {
  crunchName: string;
  crunchAddress: PublicKey | null;
  crunchData: CrunchAccount | null;
  isLoading: boolean;
}

const CrunchContext = createContext<CrunchContextValue | null>(null);

export function CrunchProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const crunchName = params.crunchname as string;
  const { anchorProvider } = useAnchorProvider();

  const crunchAccountService = useMemo(() => {
    if (!anchorProvider) return null;
    const program = getCoordinatorProgram(anchorProvider);
    return CrunchAccountServiceWithContext({ program });
  }, [anchorProvider]);

  const crunchAddress = useMemo(() => {
    if (!crunchAccountService || !crunchName) return null;
    return crunchAccountService.getCrunchAddress(crunchName);
  }, [crunchAccountService, crunchName]);

  const { data: crunchData, isLoading } = useQuery({
    queryKey: ["crunch-detail", crunchName],
    queryFn: () => crunchAccountService!.getCrunch(crunchAddress!),
    enabled: !!crunchAccountService && !!crunchAddress,
  });

  const value = useMemo<CrunchContextValue>(
    () => ({
      crunchName,
      crunchAddress,
      crunchData: crunchData ?? null,
      isLoading,
    }),
    [crunchName, crunchAddress, crunchData, isLoading]
  );

  return (
    <CrunchContext.Provider value={value}>{children}</CrunchContext.Provider>
  );
}

export function useCrunchContext() {
  const context = useContext(CrunchContext);
  if (!context) {
    throw new Error("useCrunchContext must be used within a CrunchProvider");
  }
  return context;
}
