import { Metadata } from "next";
import { EnvironmentsEditorContent } from "./content";

export const metadata: Metadata = {
  title: "Environments",
};

export default function EnvironmentsPage() {
  return <EnvironmentsEditorContent />;
}
