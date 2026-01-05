"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  publicKey: string | null;
  coordinatorStatus: CoordinatorStatus;
  isCheckingCoordinator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { connected, publicKey, connecting } = useWallet();
  const { isLocal } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const { coordinator, coordinatorLoading } = useGetCoordinator();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const isAuthenticated = isLocal || (connected && !!publicKey);
  const coordinatorStatus = coordinator?.status || CoordinatorStatus.UNREGISTERED;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: isLocal ? false : isLoading || connecting,
        publicKey: publicKey?.toString() || null,
        coordinatorStatus,
        isCheckingCoordinator: coordinatorLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
