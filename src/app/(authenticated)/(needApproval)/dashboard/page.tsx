import { Metadata } from "next";
import { CoordinatorCrunches } from "@/modules/coordinator/ui/coordinatorCrunches";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized dashboard to manage your Coordinator node",
};

export default function DashboardPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <CoordinatorCrunches />
        </CardContent>
      </Card>
    </div>
  );
}
