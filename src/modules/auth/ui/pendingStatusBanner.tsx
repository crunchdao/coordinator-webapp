"use client";
import { InfoCircle } from "@crunch-ui/icons";
import { useAuth } from "../application/context/authContext";
import { Alert, AlertDescription, AlertTitle } from "@crunch-ui/core";

export function PendingStatusBanner() {
  const { isReadOnly } = useAuth();

  if (!isReadOnly) return null;

  return (
    <Alert variant="warning" className="container mx-auto mb-3">
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
