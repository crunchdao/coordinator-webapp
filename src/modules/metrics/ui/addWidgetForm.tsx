"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Switch,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  Checkbox,
} from "@crunch-ui/core";
import { Chart, Folder, Plus, Trash } from "@crunch-ui/icons";
import { useAddWidget } from "../application/hooks/useAddWidget";
import { useUpdateWidget } from "../application/hooks/useUpdateWidget";
import { useGetWidgets } from "../application/hooks/useGetWidgets";
import {
  createMetricWidgetSchema,
  CreateMetricWidgetInput,
} from "../application/schemas/createMetricWidgetSchema";
import { Widget, MetricType } from "../domain/types";
import { useCallback } from "react";

interface AddWidgetFormProps {
  onSubmit: () => void;
  editValues?: Widget;
}

const widgetTypes = [
  {
    value: "CHART",
    label: "Chart",
    icon: Chart,
    description: "Data visualizations",
  },
  {
    value: "IFRAME",
    label: "Iframe",
    icon: Folder,
    description: "Embedded content",
  },
] as const;

export const AddWidgetForm: React.FC<AddWidgetFormProps> = ({
  onSubmit,
  editValues,
}) => {
  const { addWidget, addWidgetLoading } = useAddWidget();
  const { updateWidgets, updateWidgetsLoading } = useUpdateWidget();
  const { widgets } = useGetWidgets();
  const isEditMode = !!editValues;

  const isLoading = addWidgetLoading || updateWidgetsLoading;

  const form = useForm<CreateMetricWidgetInput>({
    resolver: zodResolver(createMetricWidgetSchema),
    defaultValues: editValues
      ? {
          ...editValues,
          tooltip: editValues.tooltip || undefined,
        }
      : {
          type: "CHART",
          name: "",
          displayName: "",
          tooltip: "",
          order: (widgets?.length || 0) + 1,
          endpointUrl: "",
        },
  });

  const widgetType = form.watch("type");
  const nativeConfig = form.watch("nativeConfiguration");
  const chartType =
    nativeConfig && "type" in nativeConfig && nativeConfig.type === "gauge"
      ? "gauge"
      : nativeConfig && "xAxis" in nativeConfig
      ? "line"
      : undefined;

  const handleTypeChange = (value: MetricType) => {
    if (value && !isEditMode) {
      const resetData: Partial<CreateMetricWidgetInput> = {
        type: value,
        name: form.getValues("name"),
        displayName: form.getValues("displayName"),
        tooltip: form.getValues("tooltip"),
        order: form.getValues("order"),
        endpointUrl: form.getValues("endpointUrl"),
      };

      if (value === "CHART") {
        // Don't set a default chart type, let user choose
      } else {
        // For IFRAME, remove nativeConfiguration
        delete (resetData as any).nativeConfiguration;
      }

      form.reset(resetData);
    }
  };

  const handleSubmit = useCallback(
    async (data: CreateMetricWidgetInput) => {
      const cleanedData = {
        ...data,
        tooltip: data.tooltip || null,
      };

      if (isEditMode) {
        await updateWidgets({
          id: editValues.id,
          column: cleanedData as Omit<Widget, "id">,
        });
      } else {
        await addWidget(cleanedData as Omit<Widget, "id">);
      }
      onSubmit();
    },
    [addWidget, updateWidgets, onSubmit, isEditMode, editValues]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Widget Type Selection */}
        <div className="space-y-2">
          <FormLabel>Widget Type</FormLabel>
          {isEditMode && (
            <p className="text-sm text-muted-foreground">
              Widget type cannot be changed when editing
            </p>
          )}
          <ToggleGroup
            type="single"
            value={widgetType}
            onValueChange={handleTypeChange}
            className="grid grid-cols-2 gap-4"
            disabled={isEditMode}
          >
            {widgetTypes.map(({ value, label, icon: Icon, description }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="flex flex-col items-center justify-center h-24 p-4 border data-[state=on]:border-primary bg-card"
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {widgetType && (
          <div className="space-y-6 pt-4 border-t">
            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., revenue_chart" {...field} />
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
                      <Input placeholder="e.g., Revenue Chart" {...field} />
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
                        value={field.value || ""}
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
                        placeholder="1"
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

            {/* Chart Configuration */}
            {widgetType === "CHART" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Chart Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "gauge") {
                          form.setValue(
                            "nativeConfiguration",
                            {
                              type: "gauge",
                              percentage: false,
                              seriesConfig: [],
                              filterConfig: [],
                            },
                            { shouldValidate: true }
                          );
                        } else if (value === "line") {
                          form.setValue(
                            "nativeConfiguration",
                            {
                              xAxis: { name: "" },
                              yAxis: { name: "" },
                              displayEvolution: false,
                              displayLegend: false,
                            },
                            { shouldValidate: true }
                          );
                        }
                      }}
                      value={chartType || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chart type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="gauge">Gauge</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                </div>

                {/* Line Chart Configuration */}
                {chartType === "line" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nativeConfiguration.xAxis.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>X Axis Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nativeConfiguration.yAxis"
                        render={({ field }) => {
                          const yAxisValue = field.value as
                            | { name?: string; names?: string[] }
                            | undefined;
                          return (
                            <FormItem>
                              <FormLabel>Y Axis Name</FormLabel>
                              <FormControl>
                                <Input
                                  value={yAxisValue?.name || ""}
                                  onChange={(e) =>
                                    field.onChange({ name: e.target.value })
                                  }
                                  placeholder="e.g., Revenue"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="nativeConfiguration.displayEvolution"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                className="w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Display Evolution
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nativeConfiguration.displayLegend"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                                className="w-4 h-4"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Display Legend
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="nativeConfiguration.groupByProperty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group By Property (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="e.g., category"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nativeConfiguration.tooltip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chart Tooltip (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value || ""}
                              placeholder="Additional tooltip for the chart"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Gauge Configuration */}
                {chartType === "gauge" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nativeConfiguration.percentage"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Display as percentage
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Card className="space-y-4 p-4">
                      <div className="flex items-center justify-between">
                        <FormLabel>Series Configuration</FormLabel>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const currentConfig = form.getValues(
                              "nativeConfiguration"
                            );
                            if (
                              currentConfig &&
                              "seriesConfig" in currentConfig
                            ) {
                              form.setValue(
                                "nativeConfiguration",
                                {
                                  ...currentConfig,
                                  seriesConfig: [
                                    ...(currentConfig.seriesConfig || []),
                                    { name: "", color: "", label: "" },
                                  ],
                                },
                                { shouldValidate: true }
                              );
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Series
                        </Button>
                      </div>

                      {(nativeConfig && "seriesConfig" in nativeConfig
                        ? nativeConfig.seriesConfig
                        : []
                      )?.map((_, seriesIndex) => (
                        <div
                          key={seriesIndex}
                          className="p-3 space-y-3 border rounded"
                        >
                          <div className="flex justify-between items-center">
                            <h6 className="text-xs font-medium">
                              Series {seriesIndex + 1}
                            </h6>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const currentConfig = form.getValues(
                                  "nativeConfiguration"
                                );
                                if (
                                  currentConfig &&
                                  "seriesConfig" in currentConfig &&
                                  currentConfig.seriesConfig
                                ) {
                                  const newSeries =
                                    currentConfig.seriesConfig.filter(
                                      (_, i) => i !== seriesIndex
                                    );
                                  form.setValue(
                                    "nativeConfiguration",
                                    {
                                      ...currentConfig,
                                      seriesConfig: newSeries,
                                    },
                                    { shouldValidate: true }
                                  );
                                }
                              }}
                            >
                              <Trash className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <FormField
                              control={form.control}
                              name={`nativeConfiguration.seriesConfig.${seriesIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Series name"
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`nativeConfiguration.seriesConfig.${seriesIndex}.color`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Color
                                  </FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value || ""}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="orange">
                                          Orange
                                        </SelectItem>
                                        <SelectItem value="yellow">
                                          Yellow
                                        </SelectItem>
                                        <SelectItem value="green">
                                          Green
                                        </SelectItem>
                                        <SelectItem value="red">Red</SelectItem>
                                        <SelectItem value="blue">
                                          Blue
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`nativeConfiguration.seriesConfig.${seriesIndex}.label`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Label
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Display label"
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="submit"
            disabled={
              isLoading || !widgetType || (widgetType === "CHART" && !chartType)
            }
            loading={isLoading}
          >
            {editValues ? "Update" : "Create"} Widget
          </Button>
        </div>
      </form>
    </Form>
  );
};
