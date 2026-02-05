"use client";

import { Button } from "@crunch-ui/core";
import { Check } from "@crunch-ui/icons";
import { INTERNAL_LINKS } from "@/utils/routes";
import Link from "next/link";

export function OnboardingCompletedStep() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
        <Check className="w-6 h-6 text-success" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          You're all set. Your Crunch is now live and ready to accept
          submissions.
        </p>
      </div>
      <Link href={INTERNAL_LINKS.DASHBOARD}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
