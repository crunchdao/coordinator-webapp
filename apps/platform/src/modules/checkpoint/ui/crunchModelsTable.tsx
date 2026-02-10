"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import {
  useGetCrunchModels,
  CrunchModelDetail,
} from "@/modules/crunch/application/hooks/useGetCrunchModels";

interface CrunchModelsTableProps {
  onAddModel: (modelId: string) => void;
}

export function CrunchModelsTable({ onAddModel }: CrunchModelsTableProps) {
  const { models, modelsLoading } = useGetCrunchModels();

  const columns: ColumnDef<CrunchModelDetail>[] = [
    {
      accessorKey: "modelId",
      header: "Model ID",
    },
    {
      accessorKey: "cruncherIndex",
      header: "Cruncher Index",
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => <SolanaAddressLink address={row.original.owner} />,
    },
    {
      accessorKey: "modelKey",
      header: "Model Key",
      cell: ({ row }) => <SolanaAddressLink address={row.original.modelKey} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddModel(row.original.modelId)}
          >
            Add to Prizes JSON
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={models} loading={modelsLoading} />;
}
