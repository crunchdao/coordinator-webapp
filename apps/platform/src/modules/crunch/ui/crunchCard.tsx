"use client";

import Link from "next/link";
import { Badge, Button, Card } from "@crunch-ui/core";
import { ExternalLink } from "@crunch-ui/icons";

const DEFAULT_CARD_IMAGE = "/images/competition-card-generic.webp";

export interface CrunchCardBadge {
  label: string;
  variant: "primary" | "secondary" | "destructive" | "success" | "warning" | "outline" | "inverted";
}

interface CrunchCardProps {
  name: string;
  displayName?: string;
  imageUrl?: string;
  badge?: CrunchCardBadge;
  address?: string;
  hubUrl?: string;
  href?: string;
}

export function CrunchCard({
  name,
  displayName,
  imageUrl,
  badge,
  address,
  hubUrl,
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
      <div className="p-4 pt-0 flex justify-between items-center">
        {address && (
          <p className="body-sm text-muted-foreground">
            {address.slice(0, 6)}...{address.slice(-6)}
          </p>
        )}
        {hubUrl && (
          <a
            href={hubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="outline" size="sm">
              <ExternalLink />
              Hub
            </Button>
          </a>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className="overflow-hidden bg-background transition-colors hover:bg-accent/50 cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden bg-background">
      {cardContent}
    </Card>
  );
}
