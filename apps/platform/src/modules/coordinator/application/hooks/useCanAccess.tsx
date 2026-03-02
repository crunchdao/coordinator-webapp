import { CoordinatorStatus } from "../../domain/types";
import { useCoordinatorAuth } from "../context/coordinatorAuthContext";

export const useCanAccess = () => {
  const { coordinatorStatus, isAuthenticated } = useCoordinatorAuth();

  const hasAllowedStatus =
    coordinatorStatus === CoordinatorStatus.APPROVED ||
    coordinatorStatus === CoordinatorStatus.PENDING ||
    coordinatorStatus === CoordinatorStatus.UNREGISTERED;

  const canAccess = isAuthenticated && hasAllowedStatus;

  return {
    canAccess,
  };
};
