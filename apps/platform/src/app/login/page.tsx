import { Metadata } from "next";
import { LoginCard } from "@/modules/coordinator/ui/loginCard";

export const metadata: Metadata = {
  title: "Login",
  description: "Connect your wallet to access the CrunchDAO platform",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <LoginCard />
    </div>
  );
}
