"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { SettingsProvider } from "@/modules/settings/application/context/settingsContext";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { AuthProvider } from "@/modules/auth/application/context/authContext";
import { StakingProvider } from "@crunchdao/staking";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";

const StakingWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { anchorProvider } = useAnchorProvider();
  const cluster = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta" ? "mainnet-beta" : "devnet";

  return (
    <StakingProvider anchorProvider={anchorProvider} cluster={cluster}>
      {children}
    </StakingProvider>
  );
};

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <WalletProvider>
        <AuthProvider>
          <StakingWrapper>
            <TooltipProvider delayDuration={50}>{children}</TooltipProvider>
          </StakingWrapper>
        </AuthProvider>
      </WalletProvider>
    </SettingsProvider>
  );
};

export default Providers;
