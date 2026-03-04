"use client";
import { InfoCircle } from "@crunch-ui/icons";
import { useCoordinatorAuth } from "../application/context/coordinatorAuthContext";
import { Alert, AlertDescription, AlertTitle } from "@crunch-ui/core";

export function PendingStatusBanner() {
  const { isReadOnly } = useCoordinatorAuth();

  if (!isReadOnly) return null;

  return (
    <Alert variant="warning" className="container mx-auto my-3">
      <InfoCircle />
      <AlertTitle>Application in Read-Only Mode</AlertTitle>
      <AlertDescription>
        Your coordinator registration is pending approval. You can browse but
        cannot perform actions. We are going to notify you when your
        registration is approved.
      </AlertDescription>
    </Alert>
  );
}
