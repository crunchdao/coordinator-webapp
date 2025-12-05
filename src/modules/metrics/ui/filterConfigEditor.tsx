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
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import { WidgetFormData } from "../application/schemas/widgetFormSchema";

interface FilterConfigEditorProps {
  form: UseFormReturn<WidgetFormData>;
}

export const FilterConfigEditor: React.FC<FilterConfigEditorProps> = ({ form }) => {
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
        <h4 className="text-sm font-medium">Filters Configuration</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFilter}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </div>

      {filters.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No filters configured. Click "Add Filter" to create one.
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
                        <FormLabel>Property *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., asset"
                          />
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
                        <FormLabel>Label *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Asset"
                          />
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
                      <FormLabel className="font-normal">
                        Auto-select first value
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