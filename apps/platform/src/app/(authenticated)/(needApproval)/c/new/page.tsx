import { Metadata } from "next";
import { CrunchConfigCreationForm } from "@/modules/config/ui/crunchConfigCreationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "New Crunch",
};

export default function NewCrunchPage() {
  return (
    <section className="container p-6 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Crunch</CardTitle>
          <CardDescription>
            Configure your competitions locally — set up leaderboard columns,
            metrics, checkpoints and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrunchConfigCreationForm />
        </CardContent>
      </Card>
    </section>
  );
}
