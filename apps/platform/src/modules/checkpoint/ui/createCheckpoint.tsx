"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import { PreparedPrize, Prize } from "@crunchdao/sdk";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { CrunchModelsTable } from "./crunchModelsTable";
import { PrizesInput } from "./prizesInput";

export function CreateCheckpoint() {
  const { crunchName, crunchData } = useCrunchContext();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(null);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Checkpoint</h1>
        <p className="text-sm text-muted-foreground">
          {crunchName} — Last checkpoint index:{" "}
          {crunchData?.lastCheckpointIndex ?? "—"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Models</CardTitle>
        </CardHeader>
        <CardContent>
          <CrunchModelsTable onAddModel={handleAddModel} />
        </CardContent>
      </Card>

      <PrizesInput
        rawText={rawPrizes}
        onRawTextChange={setRawPrizes}
        onPrizesPrepared={setPreparedPrizes}
      />
    </div>
  );
}
