import { CoordinatorStatus } from "../../domain/types";
import { useAuth } from "../context/coordinatorAuthContext";

export const useCanAccess = () => {
  const { coordinatorStatus, isAuthenticated } = useAuth();

  const hasAllowedStatus =
    coordinatorStatus === CoordinatorStatus.APPROVED ||
    coordinatorStatus === CoordinatorStatus.PENDING ||
    coordinatorStatus === CoordinatorStatus.UNREGISTERED;

  const canAccess = isAuthenticated && hasAllowedStatus;

  return {
    canAccess,
  };
};
