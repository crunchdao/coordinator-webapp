import { Metadata } from "next";
import { SettingsForm } from "@/modules/config/ui/settingsForm";
import { CrunchActionsCard } from "@/modules/crunch/ui/crunchActionsCard";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <section className="p-6 flex flex-col gap-6">
      <CrunchActionsCard />
      <SettingsForm />
    </section>
  );
}
