"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { PreparedPrize, Prize } from "@crunchdao/sdk";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useCreateCheckpoint } from "../application/hooks/useCreateCheckpoint";
import { CrunchModelsTable } from "./crunchModelsTable";
import { PrizesInput } from "./prizesInput";

export function CreateCheckpoint() {
  const { crunchName, crunchData } = useCrunchContext();
  const { createCheckpoint, createCheckpointLoading } = useCreateCheckpoint();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(
    null
  );
  const [rawPrizes, setRawPrizes] = useState("");

  const handleAddModel = useCallback(
    (modelId: string) => {
      const current: Prize[] = rawPrizes.trim()
        ? (() => {
            try {
              return JSON.parse(rawPrizes);
            } catch {
              return [];
            }
          })()
        : [];

      const entry: Prize = {
        prizeId: `prize-${modelId}`,
        timestamp: Math.floor(Date.now() / 1000),
        model: modelId,
        prize: 0,
      };

      const updated = [...current, entry];
      setRawPrizes(JSON.stringify(updated, null, 2));
    },
    [rawPrizes]
  );

  const handleCreateCheckpoint = async () => {
    if (!preparedPrizes) return;
    await createCheckpoint(preparedPrizes);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registered Models</CardTitle>
          <CardDescription>
            <p className="text-sm text-muted-foreground">
              {crunchName}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrunchModelsTable onAddModel={handleAddModel} />
        </CardContent>
      </Card>

      <PrizesInput
        rawText={rawPrizes}
        onRawTextChange={setRawPrizes}
        onPrizesPrepared={setPreparedPrizes}
        createCheckpointLoading={createCheckpointLoading}
        createCheckpointButton={
          <Button
            onClick={handleCreateCheckpoint}
            loading={createCheckpointLoading}
            disabled={createCheckpointLoading || !preparedPrizes}
          >
            Create Checkpoint
          </Button>
        }
      />
    </>
  );
}
