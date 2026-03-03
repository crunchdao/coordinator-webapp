import { Metadata } from "next";
import { CrunchConfigCreationForm } from "@/modules/config/ui/crunchConfigCreationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "New Crunch",
};

export default function NewCrunchPage() {
  return (
    <section className="container p-6 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Crunch</CardTitle>
        </CardHeader>
        <CardContent>
          <CrunchConfigCreationForm />
        </CardContent>
      </Card>
    </section>
  );
}
