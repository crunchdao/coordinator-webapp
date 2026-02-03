import { Logs } from "@/modules/log/ui/logs";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logs",
  description: "Monitor your application logs",
};

export default function PitchPage() {
  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Logs />
      </CardContent>
    </Card>
  );
}
