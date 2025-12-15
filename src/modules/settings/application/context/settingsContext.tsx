'use client';

import React, { createContext, useContext, useMemo } from 'react';

interface SettingsContextType {
  isLocal: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({
    isLocal: process.env.NODE_ENV === 'development'
  }), []);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}