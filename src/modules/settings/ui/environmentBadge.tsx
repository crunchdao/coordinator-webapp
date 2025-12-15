"use client";
import { useMemo } from "react";
import { Badge } from "@crunch-ui/core";
import { useSettings } from "@/modules/settings/application/context/settingsContext";

export const EnvironmentBadge: React.FC = () => {
  const { env } = useSettings();

  const envName = useMemo(() => {
    switch (env) {
      case "staging":
        return "Staging";
      case "production":
        return "Prod";
      default:
        return "Development";
    }
  }, [env]);

  return (
    <Badge size="sm" variant="secondary">
      {envName}
    </Badge>
  );
};
