"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { type Environment, getConfigFor } from "@/config";
import { HubUser, getHubToken, removeHubToken } from "../../domain/types";
import { getHubMe } from "../../infrastructure/service";
import { INTERNAL_LINKS } from "@/utils/routes";

interface HubEnvAuth {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: HubUser | null;
}

interface HubAuthContextType {
  staging: HubEnvAuth;
  production: HubEnvAuth;
  login: (env: Environment) => void;
  logout: () => void;
}

const HubAuthContext = createContext<HubAuthContextType | undefined>(undefined);

export const useHubAuth = () => {
  const context = useContext(HubAuthContext);
  if (!context) {
    throw new Error("useHubAuth must be used within a HubAuthProvider");
  }
  return context;
};

const INITIAL: HubEnvAuth = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const LOGGED_OUT: HubEnvAuth = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

export function HubAuthProvider({ children }: { children: ReactNode }) {
  const [staging, setStaging] = useState<HubEnvAuth>(INITIAL);
  const [production, setProduction] = useState<HubEnvAuth>(INITIAL);

  useEffect(() => {
    for (const env of ["staging", "production"] as const) {
      const set = env === "staging" ? setStaging : setProduction;
      const token = getHubToken(env);

      if (!token) {
        set(LOGGED_OUT);
        continue;
      }

      getHubMe(env)
        .then((user) => set({ isAuthenticated: true, isLoading: false, user }))
        .catch(() => {
          removeHubToken(env);
          set(LOGGED_OUT);
        });
    }
  }, []);

  const login = useCallback((env: Environment) => {
    const { hubBaseUrl, hubOAuthClientId } = getConfigFor(env);
    const redirectUri = window.location.origin + INTERNAL_LINKS.HUB_OAUTH;
    const returnUrl = window.location.pathname;
    const params = new URLSearchParams({
      client_id: hubOAuthClientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: "user",
      state: `${env}|${returnUrl}`,
    });
    window.location.href = `${hubBaseUrl}/oauth?${params.toString()}`;
  }, []);

  const logout = useCallback(() => {
    removeHubToken("staging");
    removeHubToken("production");
    setStaging(LOGGED_OUT);
    setProduction(LOGGED_OUT);
  }, []);

  return (
    <HubAuthContext.Provider value={{ staging, production, login, logout }}>
      {children}
    </HubAuthContext.Provider>
  );
}
