"use client";

import React, { createContext, useContext, useMemo } from "react";
import { config, type Environment } from "@coordinator/utils/src/config";
import { useGlobalSettings } from "../hooks/useGlobalSettings";

interface SettingsContextType {
  isLocal: boolean;
  isDevelopment: boolean;
  env: Environment;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  useGlobalSettings();

  const value = useMemo(
    () => ({
      isLocal: config.env === "local",
      isDevelopment: config.env === "development",
      env: config.env,
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
