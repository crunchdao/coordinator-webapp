"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationForm } from "./registrationForm";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { INTERNAL_LINKS } from "@/utils/routes";

export function RegistrationCard() {
  const router = useRouter();
  const { coordinatorStatus, isCheckingCoordinator } = useAuth();

  useEffect(() => {
    if (
      !isCheckingCoordinator &&
      coordinatorStatus === CoordinatorStatus.APPROVED
    ) {
      router.push(INTERNAL_LINKS.DASHBOARD);
    }
  }, [coordinatorStatus, isCheckingCoordinator, router]);

  if (isCheckingCoordinator) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Coordinator Registration</CardTitle>
          {coordinatorStatus !== CoordinatorStatus.UNREGISTERED && (
            <Badge
              size="sm"
              variant={
                coordinatorStatus === CoordinatorStatus.REJECTED
                  ? "destructive"
                  : "primary"
              }
            >
              {coordinatorStatus === CoordinatorStatus.REJECTED
                ? "Rejected"
                : "Pending"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {coordinatorStatus === CoordinatorStatus.PENDING && (
          <p className="text-muted-foreground mb-6">
            Your coordinator registration is currently under review. You will be
            notified once it has been processed.
          </p>
        )}
        {coordinatorStatus === CoordinatorStatus.REJECTED && (
          <p className="text-destructive mb-6">
            Your coordinator registration has been rejected. Please contact
            support for more information.
          </p>
        )}
        <RegistrationForm />
      </CardContent>
    </Card>
  );
}
