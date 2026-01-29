import { Metadata } from "next";
import { SettingsForm } from "@/modules/settings/ui/settingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure global platform settings",
};

export default function SettingsPage() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </>
  );
}
