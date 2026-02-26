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
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  type Environment,
  type PlatformConfig,
  DEFAULT_ENV,
  getEnvironment,
  setEnvironment as persistEnvironment,
  getConfigFor,
} from "@/config";
import { INTERNAL_LINKS } from "@/utils/routes";

interface EnvironmentContextValue {
  environment: Environment;
  config: PlatformConfig;
  switchEnvironment: (env: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export const EnvironmentProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [environment, setEnvironment] = useState<Environment>(DEFAULT_ENV);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const stored = getEnvironment();
    if (stored !== environment) {
      setEnvironment(stored);
      queryClient.clear();
    }
  }, []);

  const switchEnvironment = useCallback(
    (env: Environment) => {
      if (env === environment) return;
      persistEnvironment(env);
      setEnvironment(env);
      queryClient.clear();
      router.push(INTERNAL_LINKS.ROOT);
    },
    [environment, queryClient, router]
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
