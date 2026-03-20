"use client";
import Link from "next/link";
import { InfoCircle } from "@crunch-ui/icons";
import { Alert, AlertDescription, AlertTitle, Button } from "@crunch-ui/core";
import { useCoordinatorAuth } from "../application/context/coordinatorAuthContext";
import { INTERNAL_LINKS } from "@/utils/routes";

export function PendingStatusBanner() {
  const { isReadOnly } = useCoordinatorAuth();

  if (!isReadOnly) return null;

  return (
    <Alert variant="warning" className="container mx-auto my-3">
      <InfoCircle />
      <AlertTitle>Application in Read-Only Mode</AlertTitle>
      <AlertDescription className="flex flex-col gap-1">
        <span>
          Your coordinator registration is pending approval. You can browse but
          cannot perform actions.
        </span>
        <Link href={INTERNAL_LINKS.ONBOARDING}>
          <Button size="sm">Finish Setup</Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}
