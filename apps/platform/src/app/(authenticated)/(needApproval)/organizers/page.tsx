import { Metadata } from "next";
import { OrganizerList } from "@/modules/organizer/ui/organizerList";

export const metadata: Metadata = {
  title: "Organizations",
};

export default function OrganizersPage() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <OrganizerList />
    </div>
  );
}
