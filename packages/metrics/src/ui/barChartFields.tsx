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

interface BarChartFieldsProps {
  form: UseFormReturn<WidgetFormData>;
}

export const BarChartFields: React.FC<BarChartFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium">Bar Chart Configuration</h3>

      <FormField
        control={form.control}
        name="categoryProperty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category Property
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Property used for bar labels on the category axis (e.g.,
                  &quot;model_id&quot;, &quot;checkpoint_id&quot;)
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., model_id" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="valueProperties"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Value Properties
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Define one or more numeric properties to display as bars. Each
                  creates a separate bar (or stacked segment)
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <div className="space-y-2">
              {field.value?.map((prop, index) => (
                <div key={index} className="space-y-2 border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">
                      Property {index + 1}
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
                      value={prop.name}
                      onChange={(e) => {
                        const newValues = [...(field.value || [])];
                        newValues[index] = {
                          ...newValues[index],
                          name: e.target.value,
                        };
                        field.onChange(newValues);
                      }}
                      placeholder="Property name (e.g., ic_mean)"
                    />
                    <Input
                      value={prop.label || ""}
                      onChange={(e) => {
                        const newValues = [...(field.value || [])];
                        newValues[index] = {
                          ...newValues[index],
                          label: e.target.value,
                        };
                        field.onChange(newValues);
                      }}
                      placeholder="Display label (e.g., IC Mean)"
                    />
                  </div>
                  <Input
                    value={prop.color || ""}
                    onChange={(e) => {
                      const newValues = [...(field.value || [])];
                      newValues[index] = {
                        ...newValues[index],
                        color: e.target.value,
                      };
                      field.onChange(newValues);
                    }}
                    placeholder="Color (optional, e.g., #3B82F6)"
                  />
                </div>
              ))}
              {(!field.value || field.value.length === 0) && (
                <div className="text-sm text-muted-foreground">
                  No value properties defined. Add at least one.
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
                Add Property
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="barFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Value Format
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  Format for bar values in tooltips and axis labels
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
                  Group data rows by this property for category labels (e.g.,
                  &quot;model_id&quot; to group per model)
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., model_id" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="stacked"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Stacked Bars
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Stack bars on top of each other instead of side by side
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="horizontal"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Horizontal Bars
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Display bars horizontally instead of vertically
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
            </FormItem>
          )}
        />
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
                  Custom message when no data is available
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
