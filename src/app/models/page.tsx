"use client";
import { ModelsTable } from "@/modules/model/ui/modelsTable";
import { ModelSettingsTable } from "@/modules/model/ui/modelSettingsTable";

export default function ModelsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <ModelSettingsTable />
      <ModelsTable />
    </div>
  );
}
