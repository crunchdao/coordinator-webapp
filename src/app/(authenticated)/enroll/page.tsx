import { Metadata } from "next";
import { EnrollCard } from "@/modules/certificate/ui/enrollCard";

export const metadata: Metadata = {
  title: "Enroll Certificate",
  description: "Generate and sign a TLS certificate for your coordinator node",
};

export default function EnrollPage() {
  return (
    <section className="w-full p-6 mx-auto">
      <EnrollCard />
    </section>
  );
}
