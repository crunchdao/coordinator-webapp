"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import { PitchFormData } from "../../domain/types";

interface KeyMetricsSliceEditorProps {
  form: UseFormReturn<PitchFormData>;
  sliceIndex: number;
}

export function KeyMetricsSliceEditor({
  form,
  sliceIndex,
}: KeyMetricsSliceEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `slices.${sliceIndex}.nativeConfiguration.metrics`,
  });

  return (
    <div>
      <h2 className="title-sm">Key Metrics</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4">
            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.metrics.${index}.displayName`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Metric Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Total Revenue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.metrics.${index}.displayValue`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $1.2M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="mt-8"
            >
              <Trash />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ displayName: "", displayValue: "" })}
          className="w-full"
        >
          <Plus className="mr-2" />
          Add Metric
        </Button>
      </div>
    </div>
  );
}
