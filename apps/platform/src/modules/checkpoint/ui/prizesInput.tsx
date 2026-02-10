"use client";

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
import { PreparedPrize } from "@crunchdao/sdk";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { prizesSchema } from "../application/schemas/prizesSchema";
import { usePreparePrizes } from "../application/hooks/usePreparePrizes";
import { ZodError } from "zod";
import { useState } from "react";

const EXAMPLE_JSON = `[
  { "prizeId": "round-1-model-abc", "timestamp": 1700000000, "model": "model-id-here", "prize": 1000000 },
  { "prizeId": "round-1-model-def", "timestamp": 1700000000, "model": "model-id-here", "prize": 500000 }
]`;

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
    header: "Prize (raw)",
    cell: ({ row }) => row.original.prize.toLocaleString(),
  },
];

interface PrizesInputProps {
  rawText: string;
  onRawTextChange: (text: string) => void;
  onPrizesPrepared: (prizes: PreparedPrize[]) => void;
}

export function PrizesInput({
  rawText,
  onRawTextChange,
  onPrizesPrepared,
}: PrizesInputProps) {
  const { preparePrizes, preparePrizesLoading } = usePreparePrizes();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setError(e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "));
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
            <Button
              onClick={handlePrepare}
              disabled={!rawText.trim() || preparePrizesLoading}
              loading={preparePrizesLoading}
            >
              Prepare Prizes
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {preparedPrizes && (
        <Card>
          <CardHeader>
            <CardTitle>
              Prepared Prizes ({preparedPrizes.length} crunchers)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={preparedColumns} data={preparedPrizes} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
