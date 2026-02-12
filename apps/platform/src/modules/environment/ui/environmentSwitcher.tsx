"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { useEnvironment } from "../application/context/environmentContext";
import { getConfigFor, type Environment } from "@/config";

const environments: Environment[] = ["staging", "production"];

const labels: Record<Environment, string> = {
  staging: "Staging",
  production: "Production",
};

export const EnvironmentSwitcher: React.FC = () => {
  const { environment, switchEnvironment } = useEnvironment();

  return (
    <Tabs
      value={environment}
      onValueChange={(value) => switchEnvironment(value as Environment)}
    >
      <TabsList size="sm">
        {environments.map((env) => {
          const config = getConfigFor(env);

          return (
            <Tooltip key={env}>
              <TooltipTrigger asChild>
                <TabsTrigger value={env} size="sm">
                  {labels[env]}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <div className="flex flex-col gap-1">
                  <span>
                    <span className="text-muted-foreground">Network:</span>{" "}
                    {config.solana.cluster}
                  </span>
                  <span>
                    <span className="text-muted-foreground">Hub:</span>{" "}
                    {config.hubBaseUrl}
                  </span>
                  <span>
                    <span className="text-muted-foreground">CPI:</span>{" "}
                    {config.cpiBaseUrl}
                  </span>
                  <span>
                    <span className="text-muted-foreground">RPC:</span>{" "}
                    {config.solana.rpcUrl}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
