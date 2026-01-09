import { Metadata } from "next";
import { RegistrationCard } from "@/modules/coordinator/ui/registrationCard";

export const metadata: Metadata = {
  title: "Register",
  description: "Register as a coordinator to manage crunches",
};

export default function RegisterPage() {
  return (
    <section className="w-full p-6 mx-auto">
      <RegistrationCard />
    </section>
  );
}
