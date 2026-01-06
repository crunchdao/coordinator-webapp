import { Metadata } from "next";
import { RegistrationCard } from "@/modules/coordinator/ui/registrationCard";

export const metadata: Metadata = {
  title: "Register",
  description: "Register as a coordinator to manage crunches",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <RegistrationCard />
    </div>
  );
}
