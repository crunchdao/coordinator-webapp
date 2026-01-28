import { Metadata } from "next";
import { ModelsTable } from "@coordinator/model/src/ui/modelsTable";

export const metadata: Metadata = {
  title: "Models",
  description: "Manage and monitor your models",
};

export default function ModelsPage() {
  return (
    <>
      <ModelsTable />
    </>
  );
}
