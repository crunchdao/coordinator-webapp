import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { useAuth } from "../context/authContext";

export const useCanAccess = () => {
  const { coordinatorStatus, isAuthenticated } = useAuth();

  const hasAllowedStatus =
    coordinatorStatus === CoordinatorStatus.APPROVED ||
    coordinatorStatus === CoordinatorStatus.PENDING;

  const canAccess = isAuthenticated && hasAllowedStatus;

  return {
    canAccess,
  };
};
