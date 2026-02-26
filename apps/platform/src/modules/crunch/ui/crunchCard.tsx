"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge, Card } from "@crunch-ui/core";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";

interface CrunchCardProps {
  name: string;
  state: string;
  address?: string;
}

export function CrunchCard({ name, state, address }: CrunchCardProps) {
  return (
    <Link
      href={generateLink(INTERNAL_LINKS.CRUNCH, {
        crunchname: name,
      })}
    >
      <Card className="overflow-hidden bg-background transition-colors hover:bg-accent/50 cursor-pointer">
        <div className="relative h-64">
          <Image
            src="/images/competition-card-generic.webp"
            alt={name}
            fill
            className="object-cover"
          />
          <Badge
            variant={state === "started" ? "success" : "secondary"}
            size="sm"
            className="absolute top-2 right-2"
          >
            {state}
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <h3 className="text-lg font-bold">{name}</h3>
          </div>
        </div>
        {address && (
          <div className="p-4 pt-0">
            <p className="body-sm text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-6)}
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}
