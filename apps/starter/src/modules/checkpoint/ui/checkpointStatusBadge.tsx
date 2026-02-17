"use client";

import {
  Badge,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import type { NodeCheckpointStatus } from "../domain/types";

const STATUS_STYLES: Record<NodeCheckpointStatus, { variant: "outline" | "secondary" | "success" | "destructive"; label: string }> = {
  PENDING: { variant: "outline", label: "Pending" },
  SUBMITTED: { variant: "secondary", label: "Submitted" },
  CLAIMABLE: { variant: "success", label: "Claimable" },
  PAID: { variant: "success", label: "Paid" },
};

export function CheckpointStatusBadge({ status }: { status: NodeCheckpointStatus }) {
  const config = STATUS_STYLES[status] ?? { variant: "outline" as const, label: status };
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}
