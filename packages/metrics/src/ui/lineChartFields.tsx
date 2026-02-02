import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Checkbox,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { Plus, SmallCross, InfoCircle } from "@crunch-ui/icons";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";
import { FilterConfigEditor } from "./filterConfigEditor";
import { FormatSelect } from "@coordinator/ui/src/format-select";

interface LineChartFieldsProps {
  form: UseFormReturn<WidgetFormData>;
}

export const LineChartFields: React.FC<LineChartFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Line Chart Configuration</h3>

      <FormField
        control={form.control}
        name="xAxisName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              X Axis Property
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Property name for the X axis, typically a timestamp field
                  (e.g., "performed_at")
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., performed_at" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="yAxisSeries"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Y Axis Series
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Define one or more data series. Each series needs a property
                  name from your data, and can have a custom label and color
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <div className="space-y-2">
              {field.value?.map((series, index) => (
                <div key={index} className="space-y-2 border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">
                      Series {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => {
                        const newValues = field.value?.filter(
                          (_, i) => i !== index
                        );
                        field.onChange(newValues);
                      }}
                      disabled={(field.value?.length || 0) <= 1}
                    >
                      <SmallCross className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={series.name}
                      onChange={(e) => {
                        const newValues = [...(field.value || [])];
                        newValues[index] = {
                          ...newValues[index],
                          name: e.target.value,
                        };
                        field.onChange(newValues);
                      }}
                      placeholder="Property name (e.g., score_recent)"
                    />
                    <Input
                      value={series.label || ""}
                      onChange={(e) => {
                        const newValues = [...(field.value || [])];
                        newValues[index] = {
                          ...newValues[index],
                          label: e.target.value,
                        };
                        field.onChange(newValues);
                      }}
                      placeholder="Display label (e.g., Recent Score)"
                    />
                  </div>
                  <Input
                    value={series.color || ""}
                    onChange={(e) => {
                      const newValues = [...(field.value || [])];
                      newValues[index] = {
                        ...newValues[index],
                        color: e.target.value,
                      };
                      field.onChange(newValues);
                    }}
                    placeholder="Color (optional, e.g., #FF6B6B)"
                  />
                </div>
              ))}
              {(!field.value || field.value.length === 0) && (
                <div className="text-sm text-muted-foreground">
                  No series defined. Add at least one Y axis series.
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    { name: "", label: "" },
                  ]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Series
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="yAxisFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Y Axis Format (applies to all Y axes)
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Format for Y axis values: controls how numbers are displayed
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <FormatSelect
                value={field.value || undefined}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="groupByProperty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Group By Property
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Create separate series based on unique values of this
                    property (e.g., group by "param" to show different
                    parameters)
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., param" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
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
              <FormLabel>
                Display Evolution
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Show percentage change from first to last value in the
                    legend (e.g., +12.5%)
                  </TooltipContent>
                </Tooltip>
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
              <FormLabel>Display Legend</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Alert Configuration */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-sm font-medium">
          Alert Configuration (Optional)
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
            </TooltipTrigger>
            <TooltipContent>
              Configure alerts based on data points. When alert conditions are met, the chart will highlight affected areas
            </TooltipContent>
          </Tooltip>
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="alertField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Alert Field
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Field containing alert status (e.g., "score_success"). When false/0, triggers visual alert
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., score_success" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alertReasonField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Alert Reason Field
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Field containing the reason for the alert (e.g., "score_failed_reason")
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., score_failed_reason" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* No Data Message */}
      <FormField
        control={form.control}
        name="noDataMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              No Data Message
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Custom message displayed when no data is available for this chart. Defaults to &quot;No data available&quot;
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="No data available" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Filter Configuration */}
      <div className="space-y-4 border-t pt-4">
        <FilterConfigEditor form={form} />
      </div>
    </div>
  );
};
