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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { Chart, Link } from "@crunch-ui/icons";
import { useAddWidget } from "../application/hooks/useAddWidget";
import { useUpdateWidget } from "../application/hooks/useUpdateWidget";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import { Widget, LineChartDefinition, GaugeDefinition } from "../domain/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  widgetFormDataSchema,
  type WidgetFormData,
} from "../application/schemas/widgetFormSchema";
import { LineChartFields } from "./lineChartFields";
import { GaugeFields } from "./gaugeFields";

interface AddWidgetFormProps {
  onSubmit: () => void;
  editValues?: Widget;
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

  const getInitialValues = (): Partial<WidgetFormData> => {
    if (editValues) {
      const base = {
        type: editValues.type,
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
            filterConfig: config.filterConfig,
          };
        } else if (config.type === "line") {
          return {
            ...base,
            chartType: "line",
            xAxisName: config.xAxis.name,
            yAxisNames:
              "names" in config.yAxis
                ? config.yAxis.names
                : "name" in config.yAxis && config.yAxis.name
                ? [config.yAxis.name]
                : [],
            displayEvolution: config.displayEvolution,
            displayLegend: config.displayLegend,
            yAxisFormat: config.yAxis.format,
            groupByProperty: config.groupByProperty,
            alertField: config.alertConfig?.field,
            alertReasonField: config.alertConfig?.reasonField,
            filterConfig: config.filterConfig,
          };
        }
      }
      return base;
    }

    return {
      type: "CHART",
      displayName: "",
      tooltip: "",
      order: (widgets?.length || 0) + 1,
      endpointUrl: "",
      yAxisNames: [],
    };
  };

  const form = useForm<WidgetFormData>({
    resolver: zodResolver(widgetFormDataSchema),
    defaultValues: getInitialValues(),
    mode: "onChange",
  });

  const widgetType = form.watch("type");
  const chartType = form.watch("chartType");

  const handleSubmit = async (data: WidgetFormData) => {
    let widgetData: Omit<Widget, "id">;

    if (data.type === "IFRAME") {
      widgetData = {
        type: "IFRAME",
        displayName: data.displayName,
        tooltip: data.tooltip || null,
        order: data.order,
        endpointUrl: data.endpointUrl,
      };
    } else {
      if (data.chartType === "gauge") {
        widgetData = {
          type: "CHART",
          displayName: data.displayName,
          tooltip: data.tooltip || null,
          order: data.order,
          endpointUrl: data.endpointUrl,
          nativeConfiguration: {
            type: "gauge",
            percentage: data.percentage || false,
            filterConfig: data.filterConfig,
            seriesConfig: data.gaugeSeriesConfig,
          },
        } as Omit<GaugeDefinition, "id">;
      } else if (data.chartType === "line") {
        widgetData = {
          type: "CHART",
          displayName: data.displayName,
          tooltip: data.tooltip || null,
          order: data.order,
          endpointUrl: data.endpointUrl,
          nativeConfiguration: {
            type: "line",
            xAxis: { name: data.xAxisName || "" },
            yAxis:
              data.yAxisNames && data.yAxisNames.length > 0
                ? data.yAxisNames.length === 1
                  ? { name: data.yAxisNames[0], format: data.yAxisFormat }
                  : { names: data.yAxisNames, format: data.yAxisFormat }
                : { name: "", format: data.yAxisFormat },
            displayEvolution: data.displayEvolution || false,
            displayLegend:
              data.displayLegend !== false ? data.displayLegend : undefined,
            filterConfig: data.filterConfig,
            seriesConfig: data.seriesConfig,
            groupByProperty: data.groupByProperty,
            alertConfig:
              data.alertField && data.alertReasonField
                ? {
                    field: data.alertField,
                    reasonField: data.alertReasonField,
                  }
                : undefined,
          },
        } as Omit<LineChartDefinition, "id">;
      } else {
        return null;
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    <Link className="w-6 h-6" />
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
                  <Input
                    {...field}
                    placeholder="Helpful description for users"
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
          <LineChartFields form={form} />
        )}

        {/* Gauge Configuration */}
        {widgetType === "CHART" && chartType === "gauge" && (
          <GaugeFields form={form} />
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
