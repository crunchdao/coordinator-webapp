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
import { DeleteColumnButton } from "./deleteColumnButton";
import { AddColumnSheet } from "./addColumnSheet";
import { EditColumnSheet } from "./editColumnSheet";
import { ResetColumnsButton } from "./resetColumnsButton";
import { Settings, Folder, Percentage, Chart, User } from "@crunch-ui/icons";
import { ColumnType, LeaderboardColumn } from "../domain/types";
import { isFixedColumnType } from "../application/utils";
import { FIXED_COLUMNS_DEFAULTS } from "../domain/initial-config";

const getColumnIcon = (type: ColumnType) => {
  switch (type) {
    case "MODEL":
      return <Folder className="w-4 h-4" />;
    case "VALUE":
      return <Percentage className="w-4 h-4" />;
    case "CHART":
      return <Chart className="w-4 h-4" />;
    case "USERNAME":
      return <User className="w-4 h-4" />;
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

interface ColumnSettingsTableProps {
  columns: LeaderboardColumn[];
  loading?: boolean;
  onAdd: (column: Omit<LeaderboardColumn, "id">) => void;
  onUpdate: (id: number, column: Omit<LeaderboardColumn, "id">) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
  addLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
  resetLoading?: boolean;
}

export const ColumnSettingsTable: React.FC<ColumnSettingsTableProps> = ({
  columns,
  loading = false,
  onAdd,
  onUpdate,
  onDelete,
  onReset,
  addLoading = false,
  updateLoading = false,
  deleteLoading = false,
  resetLoading = false,
}) => {
  const allColumns = columns || [];
  const fixedColumns = allColumns
    .filter((c) => isFixedColumnType(c.type))
    .sort((a, b) => {
      const defaultsA =
        FIXED_COLUMNS_DEFAULTS[a.type as keyof typeof FIXED_COLUMNS_DEFAULTS];
      const defaultsB =
        FIXED_COLUMNS_DEFAULTS[b.type as keyof typeof FIXED_COLUMNS_DEFAULTS];
      return (defaultsA?.order ?? 0) - (defaultsB?.order ?? 0);
    });
  const customColumns = allColumns
    .filter((c) => !isFixedColumnType(c.type))
    .sort((a, b) => a.order - b.order);

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
                {allColumns.length} Columns
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 pb-6 pt-2 space-y-6">
            <div>
              <h3 className="title-sm font-medium mb-3">Fixed Columns</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-20 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Spinner />
                          <span>Loading columns...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    fixedColumns.map((column) => {
                      const defaults =
                        FIXED_COLUMNS_DEFAULTS[
                          column.type as keyof typeof FIXED_COLUMNS_DEFAULTS
                        ];
                      return (
                        <TableRow
                          key={column.id}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <span className="font-medium text-sm">
                              {defaults?.displayName ?? column.displayName}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getColumnTypeBadge(column.type)}
                          </TableCell>
                          <TableCell>
                            <code className="body-sm bg-muted px-2 py-1 rounded font-mono">
                              {column.property}
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <EditColumnSheet
                              column={column}
                              onAdd={onAdd}
                              onUpdate={onUpdate}
                              addLoading={addLoading}
                              updateLoading={updateLoading}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="title-sm font-medium mb-3">Custom Columns</h3>
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
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-20 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Spinner />
                          <span>Loading columns...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : customColumns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Settings className="w-8 h-8 opacity-20" />
                          <p className="text-sm font-medium">
                            No custom columns configured
                          </p>
                          <p className="body-sm">
                            Add your first custom column to get started
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customColumns.map((column) => (
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
                            <EditColumnSheet
                              column={column}
                              onAdd={onAdd}
                              onUpdate={onUpdate}
                              addLoading={addLoading}
                              updateLoading={updateLoading}
                            />
                            <DeleteColumnButton
                              columnId={column.id}
                              columnName={column.displayName || column.property}
                              onDelete={onDelete}
                              loading={deleteLoading}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end gap-3 items-center pt-4 border-t mt-4">
                <ResetColumnsButton onReset={onReset} loading={resetLoading} />
                <AddColumnSheet
                  onAdd={onAdd}
                  onUpdate={onUpdate}
                  addLoading={addLoading}
                  updateLoading={updateLoading}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
