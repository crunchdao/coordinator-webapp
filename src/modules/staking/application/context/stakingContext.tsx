"use client";
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { StakingClient } from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";

interface StakingContextType {
  stakingClient: StakingClient | null;
}

const StakingContext = createContext<StakingContextType | null>(null);

export const StakingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const provider = useAnchorProvider();

  const stakingClient = useMemo<StakingClient | null>(() => {
    if (!provider) {
      return null;
    }
    
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta" ? "mainnet" : "devnet";
    
    return new StakingClient({
      connection: provider.connection,
      wallet: provider.wallet,
      network: network as "mainnet" | "devnet",
    });
  }, [provider]);

  const contextValue = useMemo<StakingContextType>(
    () => ({
      stakingClient,
    }),
    [stakingClient]
  );

  return (
    <StakingContext.Provider value={contextValue}>
      {children}
    </StakingContext.Provider>
  );
};

export const useStakingContext = () => {
  const context = useContext(StakingContext);
  if (context === null) {
    throw new Error("useStakingContext must be used within a StakingProvider");
  }
  return context;
};