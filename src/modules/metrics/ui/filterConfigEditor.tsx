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
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { Plus, Trash, InfoCircle } from "@crunch-ui/icons";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";

interface FilterConfigEditorProps {
  form: UseFormReturn<WidgetFormData>;
}

export const FilterConfigEditor: React.FC<FilterConfigEditorProps> = ({
  form,
}) => {
  const filters = form.watch("filterConfig") || [];

  const addFilter = () => {
    const currentFilters = form.getValues("filterConfig") || [];
    form.setValue("filterConfig", [
      ...currentFilters,
      {
        property: "",
        label: "",
        type: "select" as const,
        autoSelectFirst: false,
      },
    ]);
  };

  const removeFilter = (index: number) => {
    const currentFilters = form.getValues("filterConfig") || [];
    form.setValue(
      "filterConfig",
      currentFilters.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">
          Filters Configuration
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
            </TooltipTrigger>
            <TooltipContent>
              Define interactive dropdown filters that allow users to dynamically filter the displayed data
            </TooltipContent>
          </Tooltip>
        </h4>
        <Button type="button" variant="outline" size="sm" onClick={addFilter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </div>

      {filters.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No filters configured. Click &quot;Add Filter&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {filters.map((_, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h5 className="text-sm font-medium">Filter {index + 1}</h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`filterConfig.${index}.property`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Property *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                            </TooltipTrigger>
                            <TooltipContent>
                              The data field name that will be used for filtering (e.g., "asset", "param")
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., asset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`filterConfig.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Label *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Display name for the filter shown in the UI (e.g., "Asset", "Parameter")
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Asset" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`filterConfig.${index}.autoSelectFirst`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        Auto-select first value
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Automatically select the first available filter option when the widget loads
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
