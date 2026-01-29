"use client";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@crunch-ui/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
} from "@crunch-ui/core";
import { TableSkeleton } from "./tableSkeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  pagination?: {
    pageSizes?: number[];
    pagination: {
      page: number;
      size: number;
      totalPages?: number;
      totalElements?: number;
    };
    onPaginationChange: (pagination: { page: number; size: number }) => void;
  };
  getSubRows?: (
    originalRow: TData,
    index: number
  ) => undefined | Partial<TData>[];
  getRowLink?: (originalRow: TData, index: number) => undefined | string;
  getIsRowSelected?: (originalRow: TData) => undefined | boolean;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  loading,
  pagination,
  getSubRows,
  getRowLink,
}: DataTableProps<TData, TValue>) => {
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    // @ts-expect-error: Because of partial type
    getSubRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const drag = useRef(false);
  const followLinkIf = useCallback(
    (event: React.MouseEvent, link: string | undefined) => {
      if (
        link &&
        !drag.current &&
        (event.target as HTMLElement)?.tagName === "TD"
      ) {
        router.push(link);
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col justify-between gap-4 h-full">
      <Table className="w-full">
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <TableHeader>
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className={cn(
                          (
                            header.column.columnDef.meta as {
                              className?: string;
                            }
                          )?.className as string | undefined
                        )}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const link = getRowLink?.(row.original, row.index);

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn("h-10", link && "cursor-pointer")}
                      onClick={(event) => followLinkIf(event, link)}
                      onMouseDown={() => (drag.current = false)}
                      onMouseMove={() => (drag.current = true)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className={cn(
                            (
                              cell.column.columnDef.meta as {
                                className?: string;
                              }
                            )?.className as string | undefined
                          )}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns?.length}
                    className="h-24 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </>
        )}
      </Table>
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};
