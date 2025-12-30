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
  Textarea,
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import { PitchFormData } from "../../domain/types";

interface RoadmapSliceEditorProps {
  form: UseFormReturn<PitchFormData>;
  sliceIndex: number;
}

export function RoadmapSliceEditor({
  form,
  sliceIndex,
}: RoadmapSliceEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `slices.${sliceIndex}.nativeConfiguration.events`,
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={`slices.${sliceIndex}.displayName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Section Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Roadmap" 
                {...field} 
                value={field.value || ""} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border-b pb-4">
            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.events.${index}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q1 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.events.${index}.markdown`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the milestone or event..."
                      rows={4}
                      {...field}
                    />
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
            >
              <Trash className="mr-2" />
              Remove Event
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ date: "", markdown: "" })}
          className="w-full"
        >
          <Plus className="mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  );
}
