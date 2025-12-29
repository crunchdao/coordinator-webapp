"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@crunch-ui/core";
import { PitchFormData } from "../../domain/types";

interface ContentSliceEditorProps {
  form: UseFormReturn<PitchFormData>;
  sliceIndex: number;
}

export function ContentSliceEditor({
  form,
  sliceIndex,
}: ContentSliceEditorProps) {
  return (
    <div>
      <h2 className="title-sm">Content</h2>
      <div>
        <FormField
          control={form.control}
          name={`slices.${sliceIndex}.nativeConfiguration.markdown`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Markdown Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your content in markdown format..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
