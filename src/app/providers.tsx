"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { SettingsProvider } from "@/modules/settings/application/context/settingsContext";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <WalletProvider>
        <TooltipProvider disableHoverableContent delayDuration={50}>
          {children}
        </TooltipProvider>
      </WalletProvider>
    </SettingsProvider>
  );
};

export default Providers;
