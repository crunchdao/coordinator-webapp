"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { WalletSelector } from "@/modules/wallet/ui/walletSelector";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { INTERNAL_LINKS } from "@/utils/routes";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";

export function LoginCard() {
  const { isAuthenticated, coordinatorStatus, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && coordinatorStatus) {
      if (coordinatorStatus === CoordinatorStatus.UNREGISTERED) {
        router.push(INTERNAL_LINKS.REGISTER);
      }
      router.push(INTERNAL_LINKS.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router, coordinatorStatus]);

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
