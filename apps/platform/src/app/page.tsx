"use client";
import { INTERNAL_LINKS } from "@coordinator/utils/src/routes";
import { Spinner } from "@crunch-ui/core";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@coordinator/auth/src/application/context/authContext";
import { CoordinatorStatus } from "@coordinator/crunch/src/domain/types";

export default function Home() {
  const { isAuthenticated, coordinatorStatus, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        if (coordinatorStatus === CoordinatorStatus.UNREGISTERED) {
          redirect(INTERNAL_LINKS.REGISTER);
        } else {
          redirect(INTERNAL_LINKS.DASHBOARD);
        }
      } else {
        redirect(INTERNAL_LINKS.LOGIN);
      }
    }
  }, [isAuthenticated, isLoading]);

  return <Spinner />;
}
