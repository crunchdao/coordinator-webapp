import { SettingsForm } from "@/modules/settings/ui/settingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
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
