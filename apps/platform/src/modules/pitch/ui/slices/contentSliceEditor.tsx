"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@crunch-ui/core";
import { PitchFormData } from "../../domain/types";
import MdEditor from "@coordinator/ui/src/md-editor";

interface ContentSliceEditorProps {
  form: UseFormReturn<PitchFormData>;
  sliceIndex: number;
}

export function ContentSliceEditor({
  form,
  sliceIndex,
}: ContentSliceEditorProps) {
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
                placeholder="Content"
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
        name={`slices.${sliceIndex}.nativeConfiguration.markdown`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Markdown Content</FormLabel>
            <FormControl>
              <MdEditor {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
