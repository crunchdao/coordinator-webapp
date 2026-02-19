"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  type Environment,
  type PlatformConfig,
  DEFAULT_ENV,
  getEnvironment,
  setEnvironment as persistEnvironment,
  getConfigFor,
} from "@/config";

interface EnvironmentContextValue {
  environment: Environment;
  config: PlatformConfig;
  switchEnvironment: (env: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export const EnvironmentProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Always start with the default so SSR and first client render match.
  // The real cookie value is synced in useEffect below.
  const [environment, setEnvironment] = useState<Environment>(DEFAULT_ENV);
  const queryClient = useQueryClient();

  // After hydration, read the persisted environment from the cookie.
  // Use switchEnvironment so the query cache is also cleared.
  useEffect(() => {
    const persisted = getEnvironment();
    if (persisted !== DEFAULT_ENV) {
      persistEnvironment(persisted);
      setEnvironment(persisted);
      queryClient.clear();
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchEnvironment = useCallback(
    (env: Environment) => {
      if (env === environment) return;
      persistEnvironment(env);
      setEnvironment(env);
      queryClient.clear();
    },
    [environment, queryClient]
  );

  const value = useMemo<EnvironmentContextValue>(
    () => ({
      environment,
      config: getConfigFor(environment),
      switchEnvironment,
    }),
    [environment, switchEnvironment]
  );

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = (): EnvironmentContextValue => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error("useEnvironment must be used within EnvironmentProvider");
  }
  return context;
};
