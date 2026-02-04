"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { WalletSelector } from "@/modules/wallet/ui/walletSelector";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useOnboarding } from "@/modules/onboarding/application/context/onboardingContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { INTERNAL_LINKS } from "@/utils/routes";

export function LoginCard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOnboardingComplete, isLoading: onboardingLoading } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !onboardingLoading && isAuthenticated) {
      if (isOnboardingComplete) {
        router.push(INTERNAL_LINKS.DASHBOARD);
      } else {
        router.push(INTERNAL_LINKS.ONBOARDING);
      }
    }
  }, [isAuthenticated, isLoading, isOnboardingComplete, onboardingLoading, router]);

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
