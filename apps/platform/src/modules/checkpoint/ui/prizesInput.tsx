"use client";

import { useCallback, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { PreparedPrize, Prize } from "@crunchdao/sdk";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { prizesSchema } from "../application/schemas/prizesSchema";
import { usePreparePrizes } from "../application/hooks/usePreparePrizes";
import { ZodError } from "zod";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";
import { CrunchModelsTable } from "@/modules/models/ui/crunchModelsTable";

const EXAMPLE_JSON = `[{ "prizeId": "round-1-model-abc", "timestamp": 1700000000, "model": "model-id", "prize": 1000000 }]`;

const preparedColumns: ColumnDef<PreparedPrize>[] = [
  {
    accessorKey: "cruncherName",
    header: "Cruncher",
  },
  {
    accessorKey: "cruncherIndex",
    header: "Index",
  },
  {
    accessorKey: "cruncherAddress",
    header: "Address",
    cell: ({ row }) => (
      <SolanaAddressLink address={row.original.cruncherAddress.toString()} />
    ),
  },
  {
    accessorKey: "prize",
    header: "Prize",
    cell: ({ row }) => row.original.prize.toLocaleString(),
  },
];

interface PrizesInputProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  onPrizesPrepared: (prizes: PreparedPrize[]) => void;
  createCheckpointButton: React.ReactNode;
  createCheckpointLoading?: boolean;
}

export function PrizesInput({
  rawText,
  onRawTextChange,
  onPrizesPrepared,
  createCheckpointButton,
  createCheckpointLoading,
}: PrizesInputProps) {
  const { preparePrizes, preparePrizesLoading } = usePreparePrizes();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleAddModel = useCallback(
    (modelId: string, prize: number) => {
      const current: Prize[] = rawText.trim()
        ? (() => {
            try {
              return JSON.parse(rawText);
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
      onRawTextChange(JSON.stringify(updated, null, 2));
      setSheetOpen(false);
    },
    [rawText, onRawTextChange]
  );

  const handlePrepare = async () => {
    setError(null);
    setPreparedPrizes(null);

    try {
      const parsed = JSON.parse(rawText);
      const prizes = prizesSchema.parse(parsed);
      const prepared = await preparePrizes(prizes);
      setPreparedPrizes(prepared);
      onPrizesPrepared(prepared);
    } catch (e) {
      if (e instanceof ZodError) {
        setError(
          e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")
        );
      } else if (e instanceof SyntaxError) {
        setError("Invalid JSON");
      } else if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const handleClear = () => {
    onRawTextChange("");
    setPreparedPrizes(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prizes JSON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder={EXAMPLE_JSON}
            value={rawText}
            onChange={(e) => onRawTextChange(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">Import from models</Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-xl w-full overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Select a model</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <CrunchModelsTable onAddModel={handleAddModel} />
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button
              onClick={handlePrepare}
              disabled={!rawText.trim() || preparePrizesLoading}
              loading={preparePrizesLoading}
            >
              Prepare Prizes
            </Button>
          </div>
        </CardContent>
      </Card>

      {preparedPrizes && (
        <Card className="relative overflow-hidden">
          {createCheckpointLoading && (
            <LoadingOverlay
              title="Creating Checkpoint"
              subtitle="Signing and sending transaction..."
            />
          )}
          <CardHeader>
            <CardTitle>
              Prepared Prizes ({preparedPrizes.length} crunchers)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTable columns={preparedColumns} data={preparedPrizes} />
            {createCheckpointButton}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
