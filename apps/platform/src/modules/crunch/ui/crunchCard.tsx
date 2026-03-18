"use client";

import Link from "next/link";
import { Badge, Card } from "@crunch-ui/core";

const DEFAULT_CARD_IMAGE = "/images/competition-card-generic.webp";

export interface CrunchCardBadge {
  label: string;
  variant:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "outline"
    | "inverted";
}

export interface CrunchCardEnvironment {
  name: string;
  address: string;
  network?: string;
}

interface CrunchCardProps {
  name: string;
  displayName?: string;
  imageUrl?: string;
  badge?: CrunchCardBadge;
  address?: string;
  environments?: CrunchCardEnvironment[];
  href?: string;
}

export function CrunchCard({
  name,
  displayName,
  imageUrl,
  badge,
  address,
  environments,
  href,
}: CrunchCardProps) {
  const cardContent = (
    <>
      <div className="relative h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl || DEFAULT_CARD_IMAGE}
          alt={displayName || name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {badge && (
          <Badge
            variant={badge.variant}
            size="sm"
            className="absolute top-2 right-2"
          >
            {badge.label}
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <h3 className="text-lg font-bold">{displayName || name}</h3>
        </div>
      </div>
      <div className="px-4 pb-3 pt-1 space-y-1">
        {environments && environments.length > 0
          ? environments.map((env) => (
              <div
                key={env.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-medium">{env.name}</span>
                <span className="text-muted-foreground font-mono">
                  {env.address.slice(0, 4)}...{env.address.slice(-4)}
                </span>
              </div>
            ))
          : address && (
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-6)}
              </p>
            )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="h-full">
        <Card className="h-full overflow-hidden bg-background transition-colors hover:bg-accent/50 cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  return <Card className="overflow-hidden bg-background">{cardContent}</Card>;
}
