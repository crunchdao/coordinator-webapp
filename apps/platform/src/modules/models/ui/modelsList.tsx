"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@crunch-ui/core";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useLocalCompetitionEnvironments } from "@/modules/config/application/hooks/useLocalCompetitionEnvironments";
import { useGetCrunchByAddress } from "../application/hooks/useGetCrunchByAddress";
import { useGetModelStates } from "../application/hooks/useGetModelStates";
import { ModelStatesTable } from "./modelStatesTable";

export function ModelsList() {
  const { crunchName: slug } = useCrunchContext();
  const { environments, environmentsLoading } =
    useLocalCompetitionEnvironments(slug);

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const selectedEnv =
    environments?.find((env) => env.address === selectedAddress) ??
    environments?.[0] ??
    null;

  const { crunch, crunchLoading } = useGetCrunchByAddress(
    selectedEnv?.address,
    selectedEnv?.network
  );

  const crunchName = crunch?.name;

  const { modelStates, modelStatesLoading } = useGetModelStates(
    crunchName
      ? {
          crunchNames: [crunchName],
          network: selectedEnv?.network,
        }
      : undefined
  );

  if (environmentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const hasEnvironments = environments && environments.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Models</CardTitle>
            <CardDescription>
              {crunchLoading || modelStatesLoading
                ? "Loading models..."
                : `${modelStates.length} model(s) deployed on the Crunch Protocol`}
            </CardDescription>
          </div>
          {hasEnvironments && (
            <Select
              value={selectedEnv?.address}
              onValueChange={setSelectedAddress}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                {environments.map((env) => (
                  <SelectItem key={env.address} value={env.address}>
                    {env.name || env.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!hasEnvironments ? (
          <p className="text-muted-foreground text-sm">
            No environments configured. Go to the Environments page to add one.
          </p>
        ) : (
          <ModelStatesTable
            data={modelStates}
            loading={crunchLoading || modelStatesLoading}
          />
        )}
      </CardContent>
    </Card>
  );
}
