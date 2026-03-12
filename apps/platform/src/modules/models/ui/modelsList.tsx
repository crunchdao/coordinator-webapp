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
import { useGetCrunchForNetwork } from "@/modules/crunch/application/hooks/useGetCrunchForNetwork";
import { useGetModelStates } from "../application/hooks/useGetModelStates";
import { useGetModels } from "@/modules/metrics/application/hooks/useGetModels";
import { ModelStatesTable } from "./modelStatesTable";
import { NodeModelsTable } from "./nodeModelsTable";

type DataSource = "on-chain" | "crunch-node";

export function ModelsList() {
  const { crunchName: slug } = useCrunchContext();
  const { environments, environmentsLoading } =
    useLocalCompetitionEnvironments(slug);

  const [selectedEnvName, setSelectedEnvName] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>("on-chain");

  const envName = selectedEnvName ?? environments?.[0]?.name;
  const selectedEnv = environments?.find((e) => e.name === envName) ?? null;

  const { crunch, crunchLoading } = useGetCrunchForNetwork(
    selectedEnv?.address,
    selectedEnv?.network
  );

  const { modelStates, modelStatesLoading } = useGetModelStates(
    dataSource === "on-chain" && crunch?.name
      ? {
          crunchNames: [crunch.name],
          network: selectedEnv?.network,
        }
      : undefined
  );

  const { models, modelsLoading } = useGetModels(
    dataSource === "crunch-node" ? selectedEnv?.coordinatorNodeUrl : undefined
  );

  const isLoading =
    dataSource === "on-chain"
      ? crunchLoading || modelStatesLoading
      : modelsLoading;

  const itemCount =
    dataSource === "on-chain" ? modelStates.length : models.length;

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
              {isLoading ? "Loading models..." : `${itemCount} model(s) found`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={dataSource}
              onValueChange={(v) => setDataSource(v as DataSource)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-chain">Crunch Protocol</SelectItem>
                <SelectItem value="crunch-node">Crunch Node</SelectItem>
              </SelectContent>
            </Select>
            {hasEnvironments && (
              <Select value={envName} onValueChange={setSelectedEnvName}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.name} value={env.name}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasEnvironments ? (
          <p className="text-muted-foreground text-sm">
            No environments configured. Go to the Environments page to add one.
          </p>
        ) : dataSource === "on-chain" ? (
          <ModelStatesTable
            data={modelStates}
            loading={crunchLoading || modelStatesLoading}
          />
        ) : (
          <NodeModelsTable data={models} loading={modelsLoading} />
        )}
      </CardContent>
    </Card>
  );
}
