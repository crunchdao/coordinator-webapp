"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { SettingsProvider } from "@/modules/settings/application/context/settingsContext";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  useGlobalSettings();
  return (
    <SettingsProvider>
      <TooltipProvider disableHoverableContent delayDuration={50}>
        {children}
      </TooltipProvider>
    </SettingsProvider>
  );
};

export default Providers;
