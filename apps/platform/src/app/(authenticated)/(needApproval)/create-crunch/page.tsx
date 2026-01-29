import { Metadata } from "next";
import { CrunchCreationForm } from "@/modules/crunch/ui/crunchCreationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "Create Crunch",
  description: "Create a new crunch competition on the CrunchDAO platform",
};

export default function CreateCrunchPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Crunch</CardTitle>
          <CardDescription>
            Set up a new Crunch: Define the name, reward pool, and participation
            limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrunchCreationForm />
        </CardContent>
      </Card>
    </div>
  );
}
