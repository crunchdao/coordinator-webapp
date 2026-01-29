"use client";

import React, { createContext, useContext } from "react";
import { useGlobalSettings } from "../hooks/useGlobalSettings";

const SettingsContext = createContext<undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  useGlobalSettings();

  return (
    <SettingsContext.Provider value={undefined}>
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
