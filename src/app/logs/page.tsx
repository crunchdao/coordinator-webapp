import { Logs } from "@/modules/log/ui/logs";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export default function LogsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Logs />
        </CardContent>
      </Card>
    </div>
  );
}
