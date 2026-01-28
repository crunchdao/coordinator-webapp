import { useSettings } from "@coordinator/settings/src/application/context/settingsContext";
import { CoordinatorStatus } from "@coordinator/crunch/src/domain/types";
import { useAuth } from "../context/authContext";

export const useCanAccess = () => {
  const { coordinatorStatus, isAuthenticated } = useAuth();
  const { isDevelopment, isLocal } = useSettings();

  const hasAllowedStatus =
    coordinatorStatus === CoordinatorStatus.APPROVED ||
    coordinatorStatus === CoordinatorStatus.PENDING;
  const isDevMode = isDevelopment || isLocal;

  const canAccess = isAuthenticated && (hasAllowedStatus || isDevMode);

  return {
    canAccess,
  };
};
