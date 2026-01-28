import { Metadata } from "next";
import { CrunchCreationForm } from "@coordinator/crunch/src/ui/crunchCreationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { LocalRestrictedWrapper } from "@coordinator/auth/src/ui/localRestrictedWrapper";

export const metadata: Metadata = {
  title: "Create Crunch",
  description: "Create a new crunch competition on the CrunchDAO platform",
};

export default function CreateCrunchPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <LocalRestrictedWrapper message="Crunch creation requires blockchain connection">
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
      </LocalRestrictedWrapper>
    </div>
  );
}
