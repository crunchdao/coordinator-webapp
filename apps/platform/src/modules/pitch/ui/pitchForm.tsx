"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { Save, Eye, EyeClosed } from "@crunch-ui/icons";
import { SliceManager, SlicesRenderer, type Slice } from "@crunchdao/slices";
import { pitchFormSchema } from "../application/schemas/pitch";
import { PitchFormData } from "../domain/types";

export function PitchForm() {
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<PitchFormData>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      displayName: "",
      shortDescription: "",
      websiteUrl: undefined,
      discordUrl: undefined,
      twitterUrl: undefined,
      externalUrl: undefined,
      externalUrlText: undefined,
      slices: [],
    },
  });

  const slices = useWatch({
    control: form.control,
    name: "slices",
  });

  const handleCreate = (slice: Omit<Slice, "id">) => {
    const currentSlices = form.getValues("slices");
    const newSlice = { ...slice, id: Date.now() } as Slice;
    form.setValue("slices", [...currentSlices, newSlice], {
      shouldDirty: true,
    });
  };

  const handleUpdate = (slice: Slice, originalName: string) => {
    const currentSlices = form.getValues("slices");
    const updatedSlices = currentSlices.map((s) =>
      s.name === originalName ? slice : s
    );
    console.log(updatedSlices);
    form.setValue("slices", updatedSlices, { shouldDirty: true });
  };

  const handleDelete = (slice: Slice) => {
    const currentSlices = form.getValues("slices");
    const filteredSlices = currentSlices.filter((s) => s.id !== slice.id);
    form.setValue("slices", filteredSlices, { shouldDirty: true });
  };

  const onSubmit = (data: PitchFormData) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pitch.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <div>
            <CardTitle>Basic Information</CardTitle>
            <div className="grid gap-3 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pitch display name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
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
                name="discordUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://discord.gg/..."
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
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
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
                name="externalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL</FormLabel>
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
                name="externalUrlText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Link text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>

        <SliceManager
          slices={slices || []}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          title="Content Slices"
        />

        <div className="flex justify-end items-center">
          <Button size="lg" onClick={form.handleSubmit(onSubmit)}>
            Download <Save />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
