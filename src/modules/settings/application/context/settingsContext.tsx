"use client";

import React, { createContext, useContext, useMemo } from "react";
import { config } from "@/utils/config";
import { useGlobalSettings } from "../hooks/useGlobalSettings";

interface SettingsContextType {
  isLocal: boolean;
  version: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  useGlobalSettings();

  const value = useMemo(
    () => ({
      isLocal: config.env === "development",
      version: config.version,
    }),
    []
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
