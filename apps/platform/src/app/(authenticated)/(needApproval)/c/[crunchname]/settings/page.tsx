import { Metadata } from "next";
import { SettingsEditorContent } from "./content";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsEditorContent />;
}
