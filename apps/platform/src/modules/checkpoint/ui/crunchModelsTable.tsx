"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge, Button } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetModelStates } from "@/modules/models/application/hooks/useGetModelStates";
import { ModelState } from "@/modules/models/domain/types";

interface CrunchModelsTableProps {
  onAddModel: (modelId: string) => void;
}

export function CrunchModelsTable({ onAddModel }: CrunchModelsTableProps) {
  const { crunchName } = useCrunchContext();
  const { modelStates, modelStatesLoading } = useGetModelStates({
    crunchNames: [crunchName],
  });

  const columns: ColumnDef<ModelState>[] = [
    {
      accessorKey: "model.id",
      header: "Model ID",
    },
    {
      accessorKey: "desiredState",
      header: "State",
      cell: ({ row }) => (
        <Badge
          variant={row.original.desiredState === "START" ? "success" : "secondary"}
          size="sm"
        >
          {row.original.desiredState}
        </Badge>
      ),
    },
    {
      accessorKey: "model.address",
      header: "Model",
      cell: ({ row }) => <SolanaAddressLink address={row.original.model.address} />,
    },
    {
      accessorKey: "cruncherPubKey",
      header: "Cruncher",
      cell: ({ row }) => <SolanaAddressLink address={row.original.cruncherPubKey} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddModel(row.original.model.id)}
          >
            Add
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={modelStates} loading={modelStatesLoading} />;
}
