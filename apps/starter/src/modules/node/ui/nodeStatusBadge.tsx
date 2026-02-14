"use client";

import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useNodeHealth } from "../application/hooks/useNodeHealth";

export function NodeStatusBadge() {
  const { nodeStatus } = useNodeHealth();

  const dotColor = nodeStatus.isOnline
    ? "bg-green-500"
    : "bg-red-500";

  const label = nodeStatus.isOnline
    ? nodeStatus.info?.crunch_id ?? "Connected"
    : "Offline";

  const tooltipLines: string[] = [];
  if (nodeStatus.isOnline) {
    if (nodeStatus.info?.crunch_id) {
      tooltipLines.push(`Crunch: ${nodeStatus.info.crunch_id}`);
    }
    tooltipLines.push(`Models: ${nodeStatus.modelCount}`);
    tooltipLines.push(`Feeds: ${nodeStatus.feedCount}`);
    tooltipLines.push(`Checkpoints: ${nodeStatus.checkpointCount}`);
  } else {
    tooltipLines.push("Node is unreachable");
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          size="sm"
          className="gap-1.5 cursor-default"
        >
          <span
            className={cn("h-2 w-2 rounded-full shrink-0", dotColor)}
          />
          <span className="text-xs">{label}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs whitespace-pre-line">
        {tooltipLines.join("\n")}
      </TooltipContent>
    </Tooltip>
  );
}
