import { Metadata } from "next";
import { LoginCard } from "@coordinator/auth/src/ui/loginCard";

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
