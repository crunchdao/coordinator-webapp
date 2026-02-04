import { Metadata } from "next";
import { OnboardingPanel } from "@/modules/onboarding/ui/onboardingPanel";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Complete the onboarding steps to deploy your Crunch",
};

export default function OnboardingPage() {
  return (
    <section className="w-full p-6 mx-auto">
      <OnboardingPanel />
    </section>
  );
}
