"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@crunch-ui/core";
import { Chart, Folder } from "@crunch-ui/icons";
import { useAddWidget } from "../application/hooks/useAddWidget";
import { useUpdateWidget } from "../application/hooks/useUpdateWidget";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import { Widget, LineChartDefinition, GaugeDefinition } from "../domain/types";
import { useForm } from "react-hook-form";

interface AddWidgetFormProps {
  onSubmit: () => void;
  editValues?: Widget;
}

interface FormData {
  type: "CHART" | "IFRAME";
  name: string;
  displayName: string;
  tooltip?: string;
  order: number;
  endpointUrl: string;
  chartType?: "line" | "gauge";
  // Line chart config
  xAxisName?: string;
  yAxisName?: string;
  displayEvolution?: boolean;
  displayLegend?: boolean;
  // Gauge config
  percentage?: boolean;
}

export const AddWidgetForm: React.FC<AddWidgetFormProps> = ({
  onSubmit,
  editValues,
}) => {
  const { addWidget, addWidgetLoading } = useAddWidget();
  const { updateWidgets, updateWidgetsLoading } = useUpdateWidget();
  const { widgets } = useGetWidgets();
  const isEditMode = !!editValues;

  const isLoading = addWidgetLoading || updateWidgetsLoading;

  const getInitialValues = (): FormData => {
    if (editValues) {
      const base = {
        type: editValues.type,
        name: editValues.name,
        displayName: editValues.displayName,
        tooltip: editValues.tooltip || "",
        order: editValues.order,
        endpointUrl: editValues.endpointUrl,
      };

      if (editValues.type === "CHART" && "nativeConfiguration" in editValues) {
        const config = editValues.nativeConfiguration;
        if ("type" in config && config.type === "gauge") {
          return {
            ...base,
            chartType: "gauge",
            percentage: config.percentage,
          };
        } else {
          return {
            ...base,
            chartType: "line",
            xAxisName: config.xAxis.name,
            yAxisName: "name" in config.yAxis ? config.yAxis.name : "",
            displayEvolution: config.displayEvolution,
            displayLegend: config.displayLegend,
          };
        }
      }
      return base;
    }

    return {
      type: "CHART",
      name: "",
      displayName: "",
      tooltip: "",
      order: (widgets?.length || 0) + 1,
      endpointUrl: "",
    };
  };

  const form = useForm<FormData>({
    defaultValues: getInitialValues(),
  });

  const widgetType = form.watch("type");
  const chartType = form.watch("chartType");

  const handleSubmit = async (data: FormData) => {
    if (!data.name || !data.displayName || !data.endpointUrl) {
      console.error("Missing required fields");
      return;
    }

    try {
      let widgetData: Omit<Widget, "id">;

      if (data.type === "IFRAME") {
        widgetData = {
          type: "IFRAME",
          name: data.name,
          displayName: data.displayName,
          tooltip: data.tooltip || null,
          order: data.order,
          endpointUrl: data.endpointUrl,
        };
      } else {
        // CHART type
        if (data.chartType === "gauge") {
          widgetData = {
            type: "CHART",
            name: data.name,
            displayName: data.displayName,
            tooltip: data.tooltip || null,
            order: data.order,
            endpointUrl: data.endpointUrl,
            nativeConfiguration: {
              type: "gauge",
              percentage: data.percentage || false,
            },
          } as Omit<GaugeDefinition, "id">;
        } else {
          // Line chart
          widgetData = {
            type: "CHART",
            name: data.name,
            displayName: data.displayName,
            tooltip: data.tooltip || null,
            order: data.order,
            endpointUrl: data.endpointUrl,
            nativeConfiguration: {
              type: "line",
              xAxis: { name: data.xAxisName || "" },
              yAxis: { name: data.yAxisName || "" },
              displayEvolution: data.displayEvolution || false,
              displayLegend: data.displayLegend || false,
            },
          } as Omit<LineChartDefinition, "id">;
        }
      }

      if (isEditMode && editValues) {
        updateWidgets({
          id: editValues.id,
          column: widgetData,
        });
      } else {
        addWidget(widgetData);
      }

      onSubmit();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Widget Type Selection */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget Type</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isEditMode}
                  className="grid grid-cols-2 gap-4"
                >
                  <ToggleGroupItem
                    value="CHART"
                    className="flex flex-col items-center justify-center h-24 p-4 border data-[state=on]:border-primary bg-card"
                  >
                    <Chart className="w-6 h-6" />
                    Chart
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="IFRAME"
                    className="flex flex-col items-center justify-center h-24 p-4 border data-[state=on]:border-primary bg-card"
                  >
                    <Folder className="w-6 h-6" />
                    Iframe
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              {isEditMode && (
                <p className="text-sm text-muted-foreground">
                  Widget type cannot be changed when editing
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Chart Type Selection */}
        {widgetType === "CHART" && (
          <FormField
            control={form.control}
            name="chartType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chart Type</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={isEditMode}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="gauge">Gauge</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Common Fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Widget Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., revenue_chart" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Revenue Chart" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endpointUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://api.example.com/metrics"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tooltip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tooltip (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Helpful description for users"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Line Chart Configuration */}
        {widgetType === "CHART" && chartType === "line" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Line Chart Configuration</h3>

            <FormField
              control={form.control}
              name="xAxisName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X Axis Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Date" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yAxisName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Y Axis Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Revenue" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayEvolution"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Display Evolution
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayLegend"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Display Legend</FormLabel>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Gauge Configuration */}
        {widgetType === "CHART" && chartType === "gauge" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">Gauge Configuration</h3>

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Display as percentage
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="submit"
            disabled={isLoading || (widgetType === "CHART" && !chartType)}
            loading={isLoading}
          >
            {editValues ? "Update" : "Create"} Widget
          </Button>
        </div>
      </form>
    </Form>
  );
};
