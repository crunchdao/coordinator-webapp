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
} from "@crunch-ui/core";
import { Plus, SmallCross } from "@crunch-ui/icons";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";
import { FilterConfigEditor } from "./filterConfigEditor";

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
            <FormLabel>X Axis Property</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., performed_at" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="yAxisNames"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Y Axis Properties</FormLabel>
            <div className="space-y-2">
              {field.value?.map((name, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => {
                      const newValues = [...(field.value || [])];
                      newValues[index] = e.target.value;
                      field.onChange(newValues);
                    }}
                    placeholder="e.g., score_recent"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      const newValues = field.value?.filter(
                        (_, i) => i !== index
                      );
                      field.onChange(newValues);
                    }}
                    disabled={(field.value?.length || 0) <= 1}
                  >
                    <SmallCross />
                  </Button>
                </div>
              ))}
              {(!field.value || field.value.length === 0) && (
                <Input
                  placeholder="e.g., score_recent"
                  onChange={(e) => {
                    field.onChange([e.target.value]);
                  }}
                />
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  field.onChange([...(field.value || []), ""]);
                }}
              >
                <Plus />
                Add Y Axis
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
            <FormLabel>Y Axis Format (applies to all Y axes)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., decimal:2" />
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
              <FormLabel>Group By Property</FormLabel>
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
              <FormLabel className="font-normal">Display Evolution</FormLabel>
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

      {/* Alert Configuration */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="text-sm font-medium">Alert Configuration (Optional)</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="alertField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Field</FormLabel>
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
                <FormLabel>Alert Reason Field</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., score_failed_reason" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Filter Configuration */}
      <div className="space-y-4 border-t pt-4">
        <FilterConfigEditor form={form} />
      </div>
    </div>
  );
};
