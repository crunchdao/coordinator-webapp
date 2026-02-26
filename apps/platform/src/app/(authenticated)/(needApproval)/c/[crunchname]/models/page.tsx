import { Metadata } from "next";
import { ModelsList } from "@/modules/models/ui/modelsList";

export const metadata: Metadata = {
  title: "Models",
};

export default function ModelsPage() {
  return (
    <section className="p-6 space-y-6">
      <ModelsList />
    </section>
  );
}
