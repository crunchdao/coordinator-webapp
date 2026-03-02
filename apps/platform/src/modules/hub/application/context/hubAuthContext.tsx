"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { getConfig } from "@/config";
import { HubUser } from "../../domain/types";
import { getHubMe } from "../../infrastructure/service";
import { INTERNAL_LINKS } from "@/utils/routes";

const HUB_TOKEN_COOKIE = "hub-access-token";

interface HubAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: HubUser | null;
  token: string | null;
  login: () => void;
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

interface HubAuthProviderProps {
  children: ReactNode;
}

export function HubAuthProvider({ children }: HubAuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<HubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get(HUB_TOKEN_COOKIE);
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const user = await getHubMe();
        setUser(user);
      } catch {
        Cookies.remove(HUB_TOKEN_COOKIE);
        setToken(null);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const login = useCallback(() => {
    const { hubBaseUrl } = getConfig();
    const clientId = process.env.NEXT_PUBLIC_HUB_OAUTH_CLIENT_ID;

    if (!clientId) {
      return;
    }

    const redirectUri = window.location.origin + INTERNAL_LINKS.HUB_OAUTH;
    const returnUrl = window.location.pathname;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: "user",
      state: returnUrl,
    });

    const oauthUrl = `${hubBaseUrl}/oauth?${params.toString()}`;
    window.location.href = oauthUrl;
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(HUB_TOKEN_COOKIE);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <HubAuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </HubAuthContext.Provider>
  );
}
