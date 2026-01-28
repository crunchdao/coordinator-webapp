"use client";
import { useMemo } from "react";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { useSettings } from "@coordinator/settings/src/application/context/settingsContext";

export const EnvironmentBadge: React.FC = () => {
  const { env } = useSettings();

  const envName = useMemo(() => {
    switch (env) {
      case "staging":
        return "Staging";
      case "production":
        return "Prod";
      case "local":
        return "Local";
      default:
        return "Development";
    }
  }, [env]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge size="sm" variant="secondary">
          {envName}
        </Badge>
      </TooltipTrigger>
      {env === "local" && (
        <TooltipContent>
          Local mode – development purposes only, no onchain or Hub push.
        </TooltipContent>
      )}
    </Tooltip>
  );
};
