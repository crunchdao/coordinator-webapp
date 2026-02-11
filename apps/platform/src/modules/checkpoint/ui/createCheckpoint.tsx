"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@crunch-ui/core";
import { PreparedPrize, Prize } from "@crunchdao/sdk";
import { useCreateCheckpoint } from "../application/hooks/useCreateCheckpoint";
import { PrizesInput } from "./prizesInput";
import { CrunchModelsTable } from "@/modules/models/ui/crunchModelsTable";

export function CreateCheckpoint() {
  const { createCheckpoint, createCheckpointLoading } = useCreateCheckpoint();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(
    null
  );
  const [rawPrizes, setRawPrizes] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddModel = useCallback(
    (modelId: string, prize: number) => {
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
        prize,
      };

      const updated = [...current, entry];
      setRawPrizes(JSON.stringify(updated, null, 2));
      setSheetOpen(false);
    },
    [rawPrizes]
  );

  const handleCreateCheckpoint = async () => {
    if (!preparedPrizes) return;
    await createCheckpoint(preparedPrizes);
  };

  return (
    <PrizesInput
      rawText={rawPrizes}
      onRawTextChange={setRawPrizes}
      onPrizesPrepared={setPreparedPrizes}
      createCheckpointLoading={createCheckpointLoading}
      extraActions={
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Import from models</Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="sm:max-w-xl w-full overflow-y-auto"
            
          >
            <SheetHeader>
              <SheetTitle>Select a model</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <CrunchModelsTable onAddModel={handleAddModel} />
            </div>
          </SheetContent>
        </Sheet>
      }
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
  );
}
