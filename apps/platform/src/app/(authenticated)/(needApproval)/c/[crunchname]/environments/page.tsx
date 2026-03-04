import { Metadata } from "next";
import { EnvironmentsEditor } from "@/modules/config/ui/environmentsEditor";

export const metadata: Metadata = {
  title: "Environments",
};

export default function EnvironmentsPage() {
  return <EnvironmentsEditor />;
}
