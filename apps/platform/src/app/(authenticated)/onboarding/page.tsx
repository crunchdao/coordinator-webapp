import { Metadata } from "next";
import { OnboardingContent } from "@/modules/onboarding/ui/onboardingContent";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Complete the onboarding steps to deploy your Crunch",
};

export default function OnboardingPage() {
  return <OnboardingContent />;
}
