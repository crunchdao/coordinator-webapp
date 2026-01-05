import { RegistrationForm } from "@/modules/coordinator/ui/registrationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Coordinator Account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
