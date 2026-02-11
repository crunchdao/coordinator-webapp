"use client";

import { createContext, useContext, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetCrunches } from "../hooks/useGetCrunches";
import { Crunch } from "../../domain/types";

interface CrunchContextValue {
  crunchName: string;
  crunchData: Crunch | null;
  crunchState: string;
  isLoading: boolean;
}

const CrunchContext = createContext<CrunchContextValue | null>(null);

export function CrunchProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const crunchName = params.crunchname as string;

  const { crunches, crunchesLoading } = useGetCrunches({
    crunchNames: [crunchName],
  });

  const crunchData = crunches.length > 0 ? crunches[0] : null;
  const crunchState = crunchData?.state?.toLowerCase() ?? "unknown";

  const value = useMemo<CrunchContextValue>(
    () => ({
      crunchName,
      crunchData,
      crunchState,
      isLoading: crunchesLoading,
    }),
    [crunchName, crunchData, crunchState, crunchesLoading]
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
