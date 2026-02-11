"use client";

import { useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Input } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetModelStates } from "@/modules/models/application/hooks/useGetModelStates";
import { ModelState } from "@/modules/models/domain/types";

interface CrunchModelsTableProps {
  onAddModel: (modelId: string, prize: number) => void;
}

export function CrunchModelsTable({ onAddModel }: CrunchModelsTableProps) {
  const { crunchName } = useCrunchContext();
  const { modelStates, modelStatesLoading } = useGetModelStates({
    crunchNames: [crunchName],
  });
  const prizesRef = useRef<Record<string, string>>({});

  const columns: ColumnDef<ModelState>[] = [
    {
      accessorKey: "model.id",
      header: "Model ID",
    },
    {
      accessorKey: "cruncherPubKey",
      header: "Cruncher",
      cell: ({ row }) => <SolanaAddressLink address={row.original.cruncherPubKey} />,
    },
    {
      id: "prize",
      header: "Prize",
      cell: ({ row }) => (
        <Input
          type="number"
          placeholder="0"
          className="w-24 h-8"
          defaultValue=""
          onChange={(e) => {
            prizesRef.current[row.original.model.id] = e.target.value;
          }}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onAddModel(
                row.original.model.id,
                Number(prizesRef.current[row.original.model.id] || 0)
              )
            }
          >
            Add
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={modelStates} loading={modelStatesLoading} />;
}
