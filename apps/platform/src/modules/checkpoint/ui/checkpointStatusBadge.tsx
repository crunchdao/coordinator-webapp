"use client";

import { Badge } from "@crunch-ui/core";
import { CheckpointStatus } from "../domain/types";

const statusConfig: Record<
  CheckpointStatus,
  { label: string; variant: "warning" | "success" | "secondary" }
> = {
  LoadingPrizes: { label: "Processing", variant: "warning" },
  LoadedPrizes: { label: "Loaded", variant: "success" },
  FullyClaimed: { label: "Finished", variant: "secondary" },
};

export function CheckpointStatusBadge({
  status,
}: {
  status: CheckpointStatus;
}) {
  const config = statusConfig[status] ?? {
    label: status,
    variant: "warning" as const,
  };

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
