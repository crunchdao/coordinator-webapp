"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationForm } from "@/modules/coordinator/ui/registrationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { INTERNAL_LINKS } from "@/utils/routes";

export default function RegisterPage() {
  const router = useRouter();
  const { coordinatorStatus, isCheckingCoordinator } = useAuth();

  useEffect(() => {
    if (
      !isCheckingCoordinator &&
      coordinatorStatus === CoordinatorStatus.APPROVED
    ) {
      router.push(INTERNAL_LINKS.ROOT);
    }
  }, [coordinatorStatus, isCheckingCoordinator, router]);

  if (isCheckingCoordinator) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {coordinatorStatus === CoordinatorStatus.PENDING &&
              "Registration Pending"}
            {coordinatorStatus === CoordinatorStatus.REJECTED &&
              "Registration Rejected"}
            {coordinatorStatus === CoordinatorStatus.UNREGISTERED &&
              "Create Coordinator Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coordinatorStatus === CoordinatorStatus.PENDING && (
            <p className="text-muted-foreground">
              Your coordinator registration is currently under review. You will
              be notified once it has been processed.
            </p>
          )}
          {coordinatorStatus === CoordinatorStatus.REJECTED && (
            <p className="text-destructive">
              Your coordinator registration has been rejected. Please contact
              support for more information.
            </p>
          )}
          {coordinatorStatus === CoordinatorStatus.UNREGISTERED && (
            <RegistrationForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
