"use client";
import {
  Button,
  Card,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@crunch-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Trash,
  Folder,
  Activity,
  Chart,
  Percentage,
} from "@crunch-ui/icons";
import { z } from "zod";
import { createLeaderboardColumnSchema } from "../application/schemas/createLeaderboardSchema";
import { ColumnType } from "../domain/types";

type ColumnFormData = z.infer<typeof createLeaderboardColumnSchema>;

const columnTypes = [
  {
    value: "PROJECT",
    label: "Project",
    icon: Folder,
    description: "Basic project information",
  },
  {
    value: "VALUE",
    label: "Value",
    icon: Percentage,
    description: "Numeric metrics",
  },
  {
    value: "CHART",
    label: "Chart",
    icon: Chart,
    description: "Data visualizations",
  },
] as const;

export const AddColumnForm: React.FC = () => {
  const form = useForm<ColumnFormData>({
    resolver: zodResolver(createLeaderboardColumnSchema),
    defaultValues: {
      type: "VALUE",
    },
  });

  const submit = useCallback((data: ColumnFormData) => {
    console.log(data);
  }, []);

  const columnType = form.watch("type");

  const handleTypeChange = (value: ColumnType) => {
    if (value) {
      const resetData: Partial<ColumnFormData> = {
        type: value,
      };

      if (value === "PROJECT") {
        resetData.native_configuration = {
          type: "project",
          statusProperty: undefined,
        };
      }

      form.reset(resetData);
    }
  };

  return (
    <Form {...form}>
      <form
        role="form"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <FormLabel>Column Type</FormLabel>
          <ToggleGroup
            type="single"
            value={columnType}
            onValueChange={handleTypeChange}
            className="grid grid-cols-2 gap-4"
          >
            {columnTypes.map(({ value, label, icon: Icon, description }) => (
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

        {columnType && (
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. score_recent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Recent Score"
                        {...field}
                        value={field.value || ""}
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
                    <FormLabel>Tooltip (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Column Explanations"
                        {...field}
                        value={field.value || ""}
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
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {columnType === "VALUE" && (
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="integer">Integer</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="decimal-2">2 Decimals</SelectItem>
                          <SelectItem value="decimal-4">4 Decimals</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {columnType === "PROJECT" && (
                <FormField
                  control={form.control}
                  name="native_configuration.statusProperty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Property (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., is_active"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {columnType === "CHART" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="native_configuration.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chart Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "gauge") {
                              form.setValue(
                                "native_configuration",
                                {
                                  type: "gauge",
                                  percentage: false,
                                  seriesConfig: [],
                                },
                                { shouldValidate: true }
                              );
                            }
                          }}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select chart type..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gauge">Gauge</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("native_configuration.type") === "gauge" && (
                    <FormField
                      control={form.control}
                      name="native_configuration.percentage"
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
                  )}
                </div>

                {form.watch("native_configuration.type") === "gauge" && (
                  <Card className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Series Configuration</FormLabel>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const currentConfig = form.getValues(
                            "native_configuration"
                          );
                          if (currentConfig && currentConfig.type === "gauge") {
                            form.setValue(
                              "native_configuration",
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
                        <Plus />
                        Add Series
                      </Button>
                    </div>

                    {form
                      .watch("native_configuration.seriesConfig")
                      ?.map((_, seriesIndex) => (
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
                                  "native_configuration"
                                );
                                if (
                                  currentConfig &&
                                  currentConfig.type === "gauge" &&
                                  currentConfig.seriesConfig
                                ) {
                                  const newSeries =
                                    currentConfig.seriesConfig.filter(
                                      (_, i) => i !== seriesIndex
                                    );
                                  form.setValue(
                                    "native_configuration",
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
                              name={`native_configuration.seriesConfig.${seriesIndex}.name`}
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
                              name={`native_configuration.seriesConfig.${seriesIndex}.color`}
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
                              name={`native_configuration.seriesConfig.${seriesIndex}.label`}
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
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="submit" disabled={!columnType}>
            Add Column
          </Button>
        </div>
      </form>
    </Form>
  );
};