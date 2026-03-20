"use client";

import Link from "next/link";
import { Badge, Button, Card, toast } from "@crunch-ui/core";
import { Copy } from "@crunch-ui/icons";

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
  configureHref?: string;
  crunchersCount?: number;
  payoutAmount?: string;
}

function CopyableAddress({ address }: { address: string }) {
  return (
    <span
      role="button"
      tabIndex={0}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono hover:text-foreground transition-colors cursor-pointer"
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(address);
          toast({ title: "Copied", description: address });
        } catch {
          toast({ title: "Copy failed", variant: "destructive" });
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
    >
      {address.slice(0, 4)}...{address.slice(-4)}
      <Copy className="w-3 h-3" />
    </span>
  );
}

export function CrunchCard({
  name,
  displayName,
  imageUrl,
  badge,
  address,
  environments,
  href,
  configureHref,
  crunchersCount,
  payoutAmount,
}: CrunchCardProps) {
  const cardContent = (
    <>
      <div className="relative h-48">
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
      <div className="px-4 pb-3 pt-2 space-y-2">
        {environments && environments.length > 0
          ? environments.map((env) => (
              <div
                key={env.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="font-medium">{env.name}</span>
                <CopyableAddress address={env.address} />
              </div>
            ))
          : address && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Address</span>
                <CopyableAddress address={address} />
              </div>
            )}
        {(crunchersCount !== undefined || payoutAmount) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
            {crunchersCount !== undefined && (
              <span>
                <span className="text-foreground font-medium">
                  {crunchersCount}
                </span>{" "}
                cruncher{crunchersCount !== 1 ? "s" : ""}
              </span>
            )}
            {payoutAmount && (
              <span>
                <span className="text-foreground font-medium">
                  {Number(
                    (Number(payoutAmount) / 1_000_000).toFixed(2)
                  ).toLocaleString()}
                </span>{" "}
                USDC
              </span>
            )}
          </div>
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

  return (
    <Card className="overflow-hidden bg-background">
      {cardContent}
      {configureHref && (
        <div className="px-4 pb-3">
          <Link href={configureHref}>
            <Button variant="outline" size="sm" className="w-full">
              Configure Locally
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
