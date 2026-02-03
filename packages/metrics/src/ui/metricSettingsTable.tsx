"use client";
import Link from "next/link";
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
import { Settings, Folder, Chart, ExternalLink } from "@crunch-ui/icons";
import { MetricType, Widget } from "../domain/types";
import { DeleteWidgetButton } from "./deleteWidgetButton";
import { ResetWidgetsButton } from "./resetWidgetsButton";
import { AddWidgetSheet } from "./addWidgetSheet";
import { EditWidgetSheet } from "./editWidgetSheet";

const getIcon = (type: MetricType) => {
  switch (type) {
    case "IFRAME":
      return <Folder className="w-4 h-4" />;
    case "CHART":
      return <Chart className="w-4 h-4" />;
  }
};

const getColumnTypeBadge = (type: MetricType) => {
  return (
    <Badge variant="secondary" className="gap-1.5">
      {getIcon(type)}
      <span className="body-sm capitalize">{type.toLowerCase()}</span>
    </Badge>
  );
};

interface MetricSettingsTableProps {
  widgets: Widget[];
  loading?: boolean;
  onAdd: (widget: Omit<Widget, "id">) => void;
  onUpdate: (id: number, widget: Omit<Widget, "id">) => void;
  onDelete: (id: number) => void;
  onReset: () => void;
  addLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
  resetLoading?: boolean;
}

export const MetricSettingsTable: React.FC<MetricSettingsTableProps> = ({
  widgets,
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
              <h2 className="text-lg font-semibold">Metrics Configuration</h2>
              <Badge size="sm" variant="secondary" className="ml-2">
                {widgets?.length} Widgets
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="px-6 pb-6 pt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Widget Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Url</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
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
                ) : widgets && widgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Settings className="w-8 h-8 opacity-20" />
                        <p className="text-sm font-medium">
                          No columns configured
                        </p>
                        <p className="body-sm">
                          Add your first widget to get started
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  widgets?.map((widget) => (
                    <TableRow
                      key={widget.id}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">
                            {widget.displayName}
                          </span>
                          {widget.tooltip && (
                            <span className="body-sm text-muted-foreground line-clamp-1">
                              {widget.tooltip}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getColumnTypeBadge(widget.type)}</TableCell>
                      <TableCell>
                        {widget.endpointUrl ? (
                          <Link
                            href={
                              process.env.NEXT_PUBLIC_API_URL +
                              widget.endpointUrl
                            }
                          >
                            <Badge variant="secondary" size="sm">
                              {widget.endpointUrl}{" "}
                              <ExternalLink className="ml-2" />
                            </Badge>
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {widget.order}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditWidgetSheet
                            widget={widget}
                            widgets={widgets}
                            onAdd={onAdd}
                            onUpdate={onUpdate}
                            addLoading={addLoading}
                            updateLoading={updateLoading}
                          />
                          <DeleteWidgetButton
                            widgetId={widget.id}
                            widgetName={widget.displayName}
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
              <ResetWidgetsButton onReset={onReset} loading={resetLoading} />
              <AddWidgetSheet
                widgets={widgets}
                onAdd={onAdd}
                onUpdate={onUpdate}
                addLoading={addLoading}
                updateLoading={updateLoading}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
