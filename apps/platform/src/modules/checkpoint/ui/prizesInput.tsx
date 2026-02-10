"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { Prize } from "@crunchdao/sdk";
import { prizesSchema } from "../application/schemas/prizesSchema";
import { ZodError } from "zod";

const EXAMPLE_JSON = `[
  { "prizeId": "round-1-model-abc", "timestamp": 1700000000, "model": "model-id-here", "prize": 1000000 },
  { "prizeId": "round-1-model-def", "timestamp": 1700000000, "model": "model-id-here", "prize": 500000 }
]`;

const columns: ColumnDef<Prize>[] = [
  {
    accessorKey: "prizeId",
    header: "Prize ID",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "prize",
    header: "Prize (raw)",
    cell: ({ row }) => row.original.prize.toLocaleString(),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) =>
      new Date(row.original.timestamp * 1000).toLocaleString(),
  },
];

interface PrizesInputProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  onPrizesConfirmed: (prizes: Prize[]) => void;
}

export function PrizesInput({
  rawText,
  onRawTextChange,
  onPrizesConfirmed,
}: PrizesInputProps) {
  const [confirmedPrizes, setConfirmedPrizes] = useState<Prize[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    setConfirmedPrizes(null);

    try {
      const parsed = JSON.parse(rawText);
      const prizes = prizesSchema.parse(parsed);
      setConfirmedPrizes(prizes);
      onPrizesConfirmed(prizes);
    } catch (e) {
      if (e instanceof ZodError) {
        setError(e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "));
      } else if (e instanceof SyntaxError) {
        setError("Invalid JSON");
      } else {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    }
  };

  const handleClear = () => {
    onRawTextChange("");
    setConfirmedPrizes(null);
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
            <Button onClick={handleConfirm} disabled={!rawText.trim()}>
              Confirm Prizes
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {confirmedPrizes && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmed Prizes ({confirmedPrizes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={confirmedPrizes} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
