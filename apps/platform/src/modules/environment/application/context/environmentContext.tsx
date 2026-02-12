"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  type Environment,
  type PlatformConfig,
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
  const [environment, setEnvironment] = useState<Environment>(getEnvironment);
  const queryClient = useQueryClient();

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
