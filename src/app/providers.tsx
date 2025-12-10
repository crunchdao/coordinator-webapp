"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  useGlobalSettings();
  return (
    <TooltipProvider disableHoverableContent delayDuration={50}>
      {children}
    </TooltipProvider>
  );
};

export default Providers;
