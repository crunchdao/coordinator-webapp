"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Badge,
  Spinner,
} from "@crunch-ui/core";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardColumns } from "../infrastructure/services";
import { DeleteColumnButton } from "./deleteColumnButton";
import { AddColumnSheet } from "./addColumnSheet";
import { EditColumnSheet } from "./editColumnSheet";
import { ResetColumnsButton } from "./resetColumnsButton";
import { Settings, Folder, Percentage, Chart } from "@crunch-ui/icons";
import { ColumnType } from "../domain/types";

const getColumnIcon = (type: ColumnType) => {
  switch (type) {
    case "PROJECT":
      return <Folder className="w-4 h-4" />;
    case "VALUE":
      return <Percentage className="w-4 h-4" />;
    case "CHART":
      return <Chart className="w-4 h-4" />;
  }
};

const getColumnTypeBadge = (type: ColumnType) => {
  return (
    <Badge variant="secondary" className="gap-1.5">
      {getColumnIcon(type)}
      <span className="body-sm capitalize">{type.toLowerCase()}</span>
    </Badge>
  );
};

export const ColumnSettingsTable: React.FC = () => {
  const { data: columns, isLoading } = useQuery({
    queryKey: ["leaderboardColumns"],
    queryFn: getLeaderboardColumns,
  });

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="column-settings"
        className="border rounded-lg shadow-sm"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Column Configuration</h2>
              <Badge size="sm" variant="secondary" className="ml-2">
                {sortedColumns.length} Columns
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 pb-6 pt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner />
                        <span>Loading columns...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedColumns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Settings className="w-8 h-8 opacity-20" />
                        <p className="text-sm font-medium">
                          No columns configured
                        </p>
                        <p className="body-sm">
                          Add your first column to get started
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedColumns.map((column) => (
                    <TableRow
                      key={column.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">
                            {column.displayName || column.property}
                          </span>
                          {column.tooltip && (
                            <span className="body-sm text-muted-foreground line-clamp-1">
                              {column.tooltip}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getColumnTypeBadge(column.type)}</TableCell>
                      <TableCell>
                        <code className="body-sm bg-muted px-2 py-1 rounded font-mono">
                          {column.property}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {column.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditColumnSheet column={column} />
                          <DeleteColumnButton
                            columnId={column.id}
                            columnName={column.display_name || column.property}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-end gap-3 items-center pt-4 border-t mt-4">
              <ResetColumnsButton />
              <AddColumnSheet />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
