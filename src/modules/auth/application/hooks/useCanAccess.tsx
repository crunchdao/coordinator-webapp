import { useAuth } from "../context/authContext";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";

export const useCanAccess = () => {
  const { coordinatorStatus, isAuthenticated } = useAuth();
  const { isDevelopment, isLocal } = useSettings();

  const isApprovedCoordinator = coordinatorStatus === CoordinatorStatus.APPROVED;
  const isDevMode = isDevelopment || isLocal;

  const canAccess = isAuthenticated && (isApprovedCoordinator || isDevMode);

  return {
    canAccess,
    isApprovedCoordinator,
    isDevMode,
  };
};