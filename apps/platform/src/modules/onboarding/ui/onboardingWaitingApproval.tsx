"use client";

import { Alert, AlertDescription } from "@crunch-ui/core";
import { Hourglass, Check } from "@crunch-ui/icons";
import { useOnboarding } from "../application/onboardingContext";
import Link from "next/link";
import { EXTERNAL_LINKS } from "@crunch-ui/utils";

export function OnboardingWaitingApproval() {
  const { isApproved, isPending } = useOnboarding();

  if (isApproved) {
    return (
      <Alert variant="success">
        <Check className="w-4 h-4" />
        <AlertDescription>
          Your registration has been approved!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col text-center items-center gap-6 py-8 bg-muted text-foreground rounded">
      <p className="body max-w-md">
        Your application is being reviewed by the CrunchDAO team really soon.
      </p>

      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute inset-2 rounded-full border-primary/20 border bg-primary/30 animate-pulse" />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
          <Hourglass className="w-8 h-8 text-primary" />
        </div>
      </div>

      {isPending && (
        <>
          <p className="body-sm">
            This usually takes less than 12 hours.
            <br />
            Feel free to reach out on our{" "}
            <Link
              className="text-primary font-medium"
              href={EXTERNAL_LINKS.DISCORD}
              target="_blank"
            >
              Discord
            </Link>{" "}
            to us if you have any questions or concerns.
          </p>
        </>
      )}
    </div>
  );
}
