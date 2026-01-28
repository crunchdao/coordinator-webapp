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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Trash,
  Folder,
  Chart,
  Percentage,
  InfoCircle,
} from "@crunch-ui/icons";
import { z } from "zod";
import {
  createLeaderboardColumnSchema,
  editFixedColumnSchema,
} from "../application/schemas/createLeaderboardSchema";
import { ColumnType, LeaderboardColumn } from "../domain/types";
import { useAddColumn } from "../application/hooks/useAddColumn";
import { useUpdateColumn } from "../application/hooks/useUpdateColumn";
import { isFixedColumnType } from "../application/utils";
import { FIXED_COLUMNS_DEFAULTS } from "../domain/initial-config";

type ColumnFormData = z.infer<typeof createLeaderboardColumnSchema>;
type FixedColumnFormData = z.infer<typeof editFixedColumnSchema>;

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

interface AddColumnFormProps {
  onSuccess?: () => void;
  editValues?: LeaderboardColumn;
}

export const AddColumnForm: React.FC<AddColumnFormProps> = ({
  onSuccess,
  editValues,
}) => {
  const isEditMode = !!editValues;
  const isFixed = editValues ? isFixedColumnType(editValues.type) : false;

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(createLeaderboardColumnSchema),
    defaultValues: editValues
      ? {
          type: editValues.type,
          property: editValues.property,
          format: editValues.format,
          displayName: editValues.displayName,
          tooltip: editValues.tooltip,
          nativeConfiguration: editValues.nativeConfiguration,
          order: editValues.order,
        }
      : {
          type: "VALUE",
        },
  });

  const fixedForm = useForm<FixedColumnFormData>({
    resolver: zodResolver(editFixedColumnSchema),
    defaultValues: editValues
      ? { property: editValues.property }
      : { property: "" },
  });

  const { addColumn, addColumnLoading } = useAddColumn();
  const { updateColumn, updateColumnLoading } = useUpdateColumn();

  const submit = useCallback(
    (data: ColumnFormData) => {
      const cleanedData = {
        ...data,
        nativeConfiguration: data.nativeConfiguration || null,
        tooltip: data.tooltip || null,
        format: data.format || null,
      };

      if (isEditMode && editValues) {
        updateColumn(
          {
            id: editValues.id,
            column: cleanedData as Omit<LeaderboardColumn, "id">,
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          }
        );
      } else {
        addColumn(cleanedData, {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        });
      }
    },
    [addColumn, updateColumn, form, onSuccess, isEditMode, editValues]
  );

  const submitFixed = useCallback(
    (data: FixedColumnFormData) => {
      if (!editValues) return;
      const defaults =
        FIXED_COLUMNS_DEFAULTS[
          editValues.type as keyof typeof FIXED_COLUMNS_DEFAULTS
        ];
      updateColumn(
        {
          id: editValues.id,
          column: {
            ...defaults,
            property: data.property,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    },
    [updateColumn, onSuccess, editValues]
  );

  const columnType = form.watch("type");

  const handleTypeChange = (value: ColumnType) => {
    if (value) {
      const resetData: Partial<ColumnFormData> = {
        type: value,
      };

      if (value === "MODEL") {
        resetData.nativeConfiguration = {
          type: "model",
          statusProperty: undefined,
        };
      }

      form.reset(resetData);
    }
  };

  if (isFixed) {
    return (
      <Form {...fixedForm}>
        <form
          role="form"
          onSubmit={fixedForm.handleSubmit(submitFixed)}
          className="space-y-6"
        >
          <FormField
            control={fixedForm.control}
            name="property"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Property
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                    </TooltipTrigger>
                    <TooltipContent>
                      The data field name to display in this column. Must match
                      exactly with your data property.
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={updateColumnLoading}
              loading={updateColumnLoading}
            >
              Update Column
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        role="form"
        onSubmit={form.handleSubmit(submit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <FormLabel>Column Type</FormLabel>
          {isEditMode && (
            <p className="text-sm text-muted-foreground">
              Column type cannot be changed when editing
            </p>
          )}
          <ToggleGroup
            type="single"
            value={columnType}
            onValueChange={handleTypeChange}
            className="grid grid-cols-2 gap-4"
            disabled={isEditMode}
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
                    <FormLabel>
                      Property
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                        </TooltipTrigger>
                        <TooltipContent>
                          The data field name to display in this column. Must
                          match exactly with your data property.
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., score_recent" {...field} />
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
                    <FormLabel>
                      Display Name
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                        </TooltipTrigger>
                        <TooltipContent>
                          The text shown in the column header. This is what
                          users will see.
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Recent Score" {...field} />
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
                    <FormLabel>
                      Order
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Column position from left to right. Lower numbers
                          appear first. Use increments of 10 for easier
                          reordering.
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
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
                      <FormLabel>
                        Format
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                          </TooltipTrigger>
                          <TooltipContent>
                            How numeric values are displayed. Percentage assumes
                            decimal input (0.5 = 50%).
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
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
                          <SelectItem value="percentage">
                            Percentage (50,00%)
                          </SelectItem>
                          <SelectItem value="integer">
                            Integer (1,000,000)
                          </SelectItem>
                          <SelectItem value="compact">Compact (1M)</SelectItem>
                          <SelectItem value="decimal-1">
                            1 Decimal (1.0)
                          </SelectItem>
                          <SelectItem value="decimal-2">
                            2 Decimals (1.00)
                          </SelectItem>
                          <SelectItem value="decimal-3">
                            3 Decimals (1.000)
                          </SelectItem>
                          <SelectItem value="decimal-4">
                            4 Decimals (1.0000)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {columnType === "MODEL" && (
                <FormField
                  control={form.control}
                  name="nativeConfiguration.statusProperty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status Property (optional)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Data field containing status (boolean or string).
                            Shows a pulse indicator when true or "active".
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
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
                    name="nativeConfiguration.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chart Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "gauge") {
                              form.setValue(
                                "nativeConfiguration",
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

                  {form.watch("nativeConfiguration.type") === "gauge" && (
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
                          <FormLabel>
                            Display as percentage
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Show values as percentages in the gauge tooltip
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {form.watch("nativeConfiguration.type") === "gauge" && (
                  <Card className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        Series Configuration
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Configure the data series for your gauge. Each
                            series represents a segment with its own color.
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const currentConfig = form.getValues(
                            "nativeConfiguration"
                          );
                          if (currentConfig && currentConfig.type === "gauge") {
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
                        <Plus />
                        Add Series
                      </Button>
                    </div>

                    {form
                      .watch("nativeConfiguration.seriesConfig")
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
                                  "nativeConfiguration"
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
                )}
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={!columnType || addColumnLoading || updateColumnLoading}
            loading={addColumnLoading || updateColumnLoading}
          >
            {isEditMode ? "Update Column" : "Add Column"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
