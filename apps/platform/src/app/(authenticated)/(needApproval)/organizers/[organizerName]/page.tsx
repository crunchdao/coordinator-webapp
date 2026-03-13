import { HubConnectionRequired } from "@/modules/hub/ui/hubConnectionRequired";
import { OrganizerDetail } from "@/modules/organizer/ui/organizerDetail";
import { OrganizerMembers } from "@/modules/organizer/ui/organizerMembers";

interface OrganizerPageProps {
  params: Promise<{ organizerName: string }>;
}

export default async function OrganizerPage({ params }: OrganizerPageProps) {
  const { organizerName } = await params;

  return (
    <div className="p-6 flex flex-col gap-3">
      <HubConnectionRequired>
        <OrganizerDetail organizerName={organizerName} />
        <OrganizerMembers organizerName={organizerName} />
      </HubConnectionRequired>
    </div>
  );
}
