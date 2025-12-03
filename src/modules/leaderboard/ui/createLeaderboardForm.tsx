"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardTitle,
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
  Textarea,
} from "@crunch-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash } from "@crunch-ui/icons";
import { z } from "zod";
import { CreateLeaderboard } from "../domain/types";
import { createLeaderboardSchema } from "../application/schemas/createLeaderboardSchema";

export const CreateLeaderboardForm: React.FC = ({}) => {
  const form = useForm<{ columns: CreateLeaderboard }>({
    resolver: zodResolver(z.object({ columns: createLeaderboardSchema })),
    defaultValues: {
      columns: [
        {
          type: "PROJECT",
          property: "model_id",
          display_name: "Model ID",
          format: null,
          tooltip: null,
          native_configuration: null,
          order: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const submit = useCallback((data: { columns: CreateLeaderboard }) => {
    console.log(data.columns);
  }, []);

  return (
    <Card className="flex-1 flex flex-col gap-8 p-8">
      <CardTitle>Leaderboard Configuration</CardTitle>
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            role="form"
            onSubmit={form.handleSubmit(submit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Columns</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      type: "VALUE",
                      property: "",
                      display_name: "",
                      format: null,
                      tooltip: null,
                      native_configuration: null,
                      order: fields.length,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Column
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`column-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex justify-between items-center w-full pr-4">
                        <span className="text-sm font-semibold">
                          Column #{index + 1}:{" "}
                          {form.watch(`columns.${index}.display_name`) ||
                            form.watch(`columns.${index}.property`) ||
                            "Untitled"}
                        </span>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`columns.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value !== "VALUE") {
                                    form.setValue(
                                      `columns.${index}.format`,
                                      null
                                    );
                                  }
                                  if (value !== "CHART") {
                                    form.setValue(
                                      `columns.${index}.native_configuration`,
                                      null
                                    );
                                  }
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PROJECT">
                                    Project
                                  </SelectItem>
                                  <SelectItem value="VALUE">Value</SelectItem>
                                  <SelectItem value="STATUS">Status</SelectItem>
                                  <SelectItem value="CHART">Chart</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`columns.${index}.property`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property</FormLabel>
                              <FormControl>
                                <Input placeholder="score_recent" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`columns.${index}.display_name`}
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

                        {form.watch(`columns.${index}.type`) === "VALUE" && (
                          <FormField
                            control={form.control}
                            name={`columns.${index}.format`}
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
                                    <SelectItem value="percentage">
                                      Percentage
                                    </SelectItem>
                                    <SelectItem value="integer">
                                      Integer
                                    </SelectItem>
                                    <SelectItem value="compact">
                                      Compact
                                    </SelectItem>
                                    <SelectItem value="decimal-2">
                                      2 Decimals
                                    </SelectItem>
                                    <SelectItem value="decimal-4">
                                      4 Decimals
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name={`columns.${index}.tooltip`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tooltip</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Optional tooltip text..."
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
                          name={`columns.${index}.order`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch(`columns.${index}.type`) === "CHART" && (
                        <div className="col-span-2 space-y-4 border-t pt-4">
                          <h5 className="text-sm font-medium">
                            Chart Configuration
                          </h5>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`columns.${index}.native_configuration.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Chart Type</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      if (value === "gauge") {
                                        form.setValue(
                                          `columns.${index}.native_configuration`,
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
                                      <SelectItem value="gauge">
                                        Gauge
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {form.watch(
                              `columns.${index}.native_configuration.type`
                            ) === "gauge" && (
                              <FormField
                                control={form.control}
                                name={`columns.${index}.native_configuration.percentage`}
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

                          {form.watch(
                            `columns.${index}.native_configuration.type`
                          ) === "gauge" && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <FormLabel>Series Configuration</FormLabel>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentConfig = form.getValues(
                                      `columns.${index}.native_configuration`
                                    );
                                    if (
                                      currentConfig &&
                                      currentConfig.type === "gauge"
                                    ) {
                                      form.setValue(
                                        `columns.${index}.native_configuration`,
                                        {
                                          ...currentConfig,
                                          seriesConfig: [
                                            ...(currentConfig.seriesConfig ||
                                              []),
                                            { name: "", color: "", label: "" },
                                          ],
                                        },
                                        { shouldValidate: true }
                                      );
                                    } else {
                                      console.log("Invalid configuration");
                                    }
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Series
                                </Button>
                              </div>

                              {form
                                .watch(
                                  `columns.${index}.native_configuration.seriesConfig`
                                )
                                ?.map((_, seriesIndex) => (
                                  <div
                                    key={seriesIndex}
                                    className="p-3 space-y-3"
                                  >
                                    <div className="flex justify-between items-center">
                                      <h6 className="text-xs font-medium">
                                        Series {seriesIndex + 1}
                                      </h6>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const currentConfig = form.getValues(
                                            `columns.${index}.native_configuration`
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
                                              `columns.${index}.native_configuration`,
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
                                        name={`columns.${index}.native_configuration.seriesConfig.${seriesIndex}.name`}
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
                                        name={`columns.${index}.native_configuration.seriesConfig.${seriesIndex}.color`}
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
                                                  <SelectItem value="red">
                                                    Red
                                                  </SelectItem>
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
                                        name={`columns.${index}.native_configuration.seriesConfig.${seriesIndex}.label`}
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
                            </div>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="submit">Validate</Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
