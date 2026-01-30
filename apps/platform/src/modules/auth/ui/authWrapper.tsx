"use client";
import { useAuth } from "../application/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { INTERNAL_LINKS } from "@/utils/routes";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { Spinner } from "@crunch-ui/core";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const {
    isAuthenticated,
    isLoading,
    coordinatorStatus,
    isCheckingCoordinator,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(INTERNAL_LINKS.LOGIN);
      return;
    }

    if (
      !isLoading &&
      !isCheckingCoordinator &&
      isAuthenticated &&
      coordinatorStatus !== CoordinatorStatus.APPROVED &&
      coordinatorStatus !== CoordinatorStatus.PENDING
    ) {
      router.push(INTERNAL_LINKS.REGISTER);
    }
  }, [
    isAuthenticated,
    isLoading,
    isCheckingCoordinator,
    coordinatorStatus,
    router,
  ]);

  if (isLoading || isCheckingCoordinator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
