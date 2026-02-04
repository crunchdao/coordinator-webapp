"use client";
import { INTERNAL_LINKS } from "@/utils/routes";
import { Spinner } from "@crunch-ui/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useOnboarding } from "@/modules/onboarding/application/context/onboardingContext";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOnboardingComplete, isLoading: onboardingLoading } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !onboardingLoading) {
      if (!isAuthenticated) {
        router.push(INTERNAL_LINKS.LOGIN);
      } else if (isOnboardingComplete) {
        router.push(INTERNAL_LINKS.DASHBOARD);
      } else {
        router.push(INTERNAL_LINKS.ONBOARDING);
      }
    }
  }, [isAuthenticated, isLoading, isOnboardingComplete, onboardingLoading, router]);

  return <Spinner />;
}
