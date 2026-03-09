"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@crunch-ui/core";
import { Download, Export } from "@crunch-ui/icons";
import { useHubAuth } from "../application/context/hubAuthContext";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";

interface HubSyncButtonsProps {
  isPulling: boolean;
  isPushing: boolean;
  onPull: (envName: string, address: string, hubUrl: string) => void;
  onPush: (envName: string, address: string, hubUrl: string) => void;
}

export const HubSyncButtons: React.FC<HubSyncButtonsProps> = ({
  isPulling,
  isPushing,
  onPull,
  onPush,
}) => {
  const { isAuthenticated } = useHubAuth();
  const { crunchName } = useCrunchContext();
  const { environments } = useLocalCompetitionEnvironments(crunchName);

  const pullableEnvs = environments
    ? environments.filter((env) => env.hubUrl && env.address)
    : [];

  if (!isAuthenticated || !pullableEnvs.length) {
    return null;
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-r-none"
            variant="outline"
            disabled={isPulling}
          >
            <Download />
            Pull from Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() => onPull(env.name, env.address, env.hubUrl!)}
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-l-none border-l-0"
            variant="outline"
            disabled={isPushing}
          >
            <Export />
            Push to Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pullableEnvs.map((env) => (
            <DropdownMenuItem
              key={env.name}
              onClick={() => onPush(env.name, env.address, env.hubUrl!)}
            >
              {env.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
