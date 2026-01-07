import { Metadata } from "next";
import { ModelsTable } from "@/modules/model/ui/modelsTable";

export const metadata: Metadata = {
  title: "Models",
  description: "Manage and monitor your models",
};

export default function ModelsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-3">
      <ModelsTable />
    </div>
  );
}
