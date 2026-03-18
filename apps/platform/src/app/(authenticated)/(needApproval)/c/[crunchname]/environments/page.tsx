import { Metadata } from "next";
import { EnvironmentsEditor } from "@/modules/config/ui/environmentsEditor";

export const metadata: Metadata = {
  title: "Environments",
};

export default function EnvironmentsPage() {
  return (
    <section className="p-6 space-y-3">
      <EnvironmentsEditor />
    </section>
  );
}
