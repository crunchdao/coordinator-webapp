"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, Card } from "@crunch-ui/core";
import { ExternalLink } from "@crunch-ui/icons";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useGetCompetition } from "@/modules/competition/application/hooks/useGetCompetition";

const DEFAULT_CARD_IMAGE = "/images/competition-card-generic.webp";

interface CrunchCardProps {
  name: string;
  state: string;
  address?: string;
}

export function CrunchCard({ name, state, address }: CrunchCardProps) {
  const router = useRouter();
  const { competition, competitionLoading, competitionExists } =
    useGetCompetition(address);

  const cardImageUrl = competition?.cardImageUrl || DEFAULT_CARD_IMAGE;

  const handleCardClick = () => {
    router.push(
      generateLink(INTERNAL_LINKS.CRUNCH, {
        crunchname: name,
      })
    );
  };

  return (
    <Card
      className="overflow-hidden bg-background transition-colors hover:bg-accent/50 cursor-pointer"
      onClick={handleCardClick}
    >
        <div className="relative h-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardImageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
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
        <div className="p-4 pt-0 flex justify-between items-center">
          {address && (
            <p className="body-sm text-muted-foreground">
              {address.slice(0, 6)}...{address.slice(-6)}
            </p>
          )}
          {competition && (
            <a
              href={`${competition.url}/competitions/${competition.name}`}
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
      </Card>
  );
}
