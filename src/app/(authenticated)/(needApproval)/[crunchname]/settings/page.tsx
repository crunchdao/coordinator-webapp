import { Metadata } from "next";
import { SettingsForm } from "@/modules/settings/ui/settingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure global platform settings",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-3">
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
