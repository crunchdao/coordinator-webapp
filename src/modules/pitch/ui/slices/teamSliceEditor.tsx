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
import MdEditor from "@/ui/md-editor";

interface TeamSliceEditorProps {
  form: UseFormReturn<PitchFormData>;
  sliceIndex: number;
}

export function TeamSliceEditor({ form, sliceIndex }: TeamSliceEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `slices.${sliceIndex}.nativeConfiguration.members`,
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
              <Input placeholder="Team" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border p-4 rounded-lg">
            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.fullName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.descriptionMarkdown`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <MdEditor {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 flex-wrap **:flex-1 **:min-w-48">
              <FormField
                control={form.control}
                name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.avatarImageUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
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
                name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.twitterUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/..."
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
                name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.linkedinUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/..."
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
                name={`slices.${sliceIndex}.nativeConfiguration.members.${index}.websiteUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash className="mr-2" />
              Remove Member
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              fullName: "",
              avatarImageUrl: undefined,
              descriptionMarkdown: undefined,
              twitterUrl: undefined,
              linkedinUrl: undefined,
              websiteUrl: undefined,
            })
          }
          className="w-full"
        >
          <Plus className="mr-2" />
          Add Team Member
        </Button>
      </div>
    </div>
  );
}
