import { EnvironmentSwitcher } from "@/modules/environment/ui/environmentSwitcher";
import { HubConnectionRequired } from "@/modules/hub/ui/hubConnectionRequired";
import { OrganizerDetail } from "@/modules/organizer/ui/organizerDetail";
import { OrganizerMembers } from "@/modules/organizer/ui/organizerMembers";
import { Card, CardContent, CardHeader } from "@crunch-ui/core";

interface OrganizerPageProps {
  params: Promise<{ organizerName: string }>;
}

export default async function OrganizerPage({ params }: OrganizerPageProps) {
  const { organizerName } = await params;

  return (
    <div className="p-6 flex flex-col gap-3">
      <HubConnectionRequired>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-end">
              <EnvironmentSwitcher />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <OrganizerDetail organizerName={organizerName} />
            <OrganizerMembers organizerName={organizerName} />
          </CardContent>
        </Card>
      </HubConnectionRequired>
    </div>
  );
}
