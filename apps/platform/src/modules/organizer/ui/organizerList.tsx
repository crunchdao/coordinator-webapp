"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { HubConnectionRequired } from "@/modules/hub/ui/hubConnectionRequired";
import { useGetOrganizers } from "../application/hooks/useGetOrganizers";
import { OrganizerCard } from "./organizerCard";

export function OrganizerList() {
  return (
    <HubConnectionRequired>
      <OrganizerListContent />
    </HubConnectionRequired>
  );
}

function OrganizerListContent() {
  const { organizers, organizersLoading } = useGetOrganizers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        {organizersLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        ) : organizers.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            You are not a member of any organization yet.
          </p>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {organizers.map((org) => (
              <OrganizerCard key={org.id} organizer={org} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
