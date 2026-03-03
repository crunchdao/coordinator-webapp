import { Metadata } from "next";
import { SettingsForm } from "@/modules/config/ui/settingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <section className="p-6">
      <SettingsForm />
    </section>
  );
}
