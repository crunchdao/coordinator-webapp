"use client";
import { INTERNAL_LINKS } from "@/utils/routes";
import { Spinner } from "@crunch-ui/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCoordinatorAuth } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";

export default function Home() {
  const { isAuthenticated, isLoading, coordinatorStatus } = useCoordinatorAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(INTERNAL_LINKS.LOGIN);
      } else if (coordinatorStatus === CoordinatorStatus.UNREGISTERED) {
        router.push(INTERNAL_LINKS.ONBOARDING);
      } else {
        router.push(INTERNAL_LINKS.DASHBOARD);
      }
    }
  }, [isAuthenticated, isLoading, coordinatorStatus, router]);

  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <Spinner />
    </div>
  );
}
