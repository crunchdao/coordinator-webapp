import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Checkbox,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";
import { InfoCircle } from "@crunch-ui/icons";
import { FilterConfigEditor } from "./filterConfigEditor";

interface GaugeFieldsProps {
  form: UseFormReturn<WidgetFormData>;
}

export const GaugeFields: React.FC<GaugeFieldsProps> = ({ form }) => {
  return (
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
            <FormLabel>
              Display as percentage
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  When enabled, the gauge value will be displayed as a percentage (0-100%)
                </TooltipContent>
              </Tooltip>
            </FormLabel>
          </FormItem>
        )}
      />

      {/* TODO: Add gauge series configuration when needed */}
      <div className="text-sm text-muted-foreground">
        <p>Additional gauge configuration options will be available soon.</p>
      </div>

      {/* Filter Configuration */}
      <div className="space-y-4 border-t pt-4">
        <FilterConfigEditor form={form} />
      </div>
    </div>
  );
};
