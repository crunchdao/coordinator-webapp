"use client";

import Link from "next/link";
import { Card } from "@crunch-ui/core";
import type { Organizer } from "../domain/types";

const DEFAULT_BANNER = "/images/competition-card-generic.webp";

interface OrganizerCardProps {
  organizer: Organizer;
}

export function OrganizerCard({ organizer }: OrganizerCardProps) {
  return (
    <Link href={`/organizers/${organizer.name}`} className="h-full">
      <Card className="h-full overflow-hidden bg-background transition-colors hover:bg-accent/50 cursor-pointer">
        <div className="flex items-center gap-3 px-4 py-3">
          {organizer.logoImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={organizer.logoImageUrl}
              alt=""
              className="size-10 rounded-full border-2 border-background shrink-0"
            />
          )}
          <div className="min-w-0">
            <h3 className="font-bold truncate">{organizer.displayName}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}
