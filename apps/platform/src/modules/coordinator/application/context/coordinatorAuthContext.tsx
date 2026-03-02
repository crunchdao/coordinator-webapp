"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { CoordinatorStatus, CoordinatorState } from "../../domain/types";
import { useGetCoordinator } from "../hooks/useGetCoordinator";

interface CoordinatorAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  publicKey: string | null;
  coordinatorStatus: CoordinatorStatus;
  isCheckingCoordinator: boolean;
  coordinator: CoordinatorState | null;
  isReadOnly: boolean;
}

const CoordinatorAuthContext = createContext<
  CoordinatorAuthContextType | undefined
>(undefined);

export const useAuth = () => {
  const context = useContext(CoordinatorAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a CoordinatorAuthProvider");
  }
  return context;
};

interface CoordinatorAuthProviderProps {
  children: ReactNode;
}

export function CoordinatorAuthProvider({
  children,
}: CoordinatorAuthProviderProps) {
  const { connected, publicKey, connecting } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const { coordinator, coordinatorLoading } = useGetCoordinator();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const isAuthenticated = connected && !!publicKey;
  const coordinatorStatus =
    coordinator?.status || CoordinatorStatus.UNREGISTERED;
  const isReadOnly = coordinatorStatus === CoordinatorStatus.PENDING;

  return (
    <CoordinatorAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: isLoading || connecting,
        publicKey: publicKey?.toString() || null,
        coordinatorStatus,
        isCheckingCoordinator: coordinatorLoading,
        coordinator: coordinator?.data || null,
        isReadOnly,
      }}
    >
      {children}
    </CoordinatorAuthContext.Provider>
  );
}
