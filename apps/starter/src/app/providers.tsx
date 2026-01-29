"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { SettingsProvider } from "@/modules/settings/application/context/settingsContext";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <TooltipProvider delayDuration={50}>{children}</TooltipProvider>
    </SettingsProvider>
  );
};

export default Providers;
