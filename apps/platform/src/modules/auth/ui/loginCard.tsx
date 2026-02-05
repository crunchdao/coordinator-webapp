"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { WalletSelector } from "@/modules/wallet/ui/walletSelector";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { INTERNAL_LINKS } from "@/utils/routes";

export function LoginCard() {
  const { isAuthenticated, isLoading, coordinatorStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (coordinatorStatus === CoordinatorStatus.UNREGISTERED) {
        router.push(INTERNAL_LINKS.ONBOARDING);
      } else {
        router.push(INTERNAL_LINKS.DASHBOARD);
      }
    }
  }, [isAuthenticated, isLoading, coordinatorStatus, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>
          Connect to the <br />
          Coordinator Platform
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-center text-muted-foreground">
          Connect your wallet to access the platform
        </p>
        <WalletSelector />
      </CardContent>
    </Card>
  );
}
