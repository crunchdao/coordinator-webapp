"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { SettingsProvider } from "@/modules/settings/application/context/settingsContext";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { AuthProvider } from "@/modules/auth/application/context/authContext";
import { StakingProvider } from "@/modules/staking/application/context/stakingContext";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <WalletProvider>
        <AuthProvider>
          <StakingProvider>
            <TooltipProvider delayDuration={50}>{children}</TooltipProvider>
          </StakingProvider>
        </AuthProvider>
      </WalletProvider>
    </SettingsProvider>
  );
};

export default Providers;
