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
  const { anchorProvider } = useAnchorProvider();

  const stakingClient = useMemo<StakingClient | null>(() => {
    if (!anchorProvider) {
      return null;
    }

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta" ? "mainnet" : "devnet";

    return new StakingClient({
      connection: anchorProvider.connection,
      wallet: anchorProvider.wallet,
      network: network as "mainnet" | "devnet",
    });
  }, [anchorProvider]);

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