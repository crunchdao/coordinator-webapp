"use client";
import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TooltipProvider delayDuration={50}>{children}</TooltipProvider>
  );
};

export default Providers;
