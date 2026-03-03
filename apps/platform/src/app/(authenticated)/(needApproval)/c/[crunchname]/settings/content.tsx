"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
  Spinner,
} from "@crunch-ui/core";
import { settingsSchema, SettingsFormData } from "@/modules/config/domain/schemas";
import {
  useCompetitionSettings,
  useSaveCompetitionSettings,
} from "@/modules/config/application/hooks/useCompetitionSettings";
import { Competition } from "@/modules/competition/domain/types";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

export function SettingsEditorContent() {
  const { crunchName } = useCrunchContext();
  const slug = crunchName;

  const { settings, settingsLoading } = useCompetitionSettings(slug);
  const { saveSettings, saveSettingsLoading } =
    useSaveCompetitionSettings(slug);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      displayName: "",
      fullName: "",
      shortDescription: "",
      visibility: "HIDDEN",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name || "",
        displayName: settings.displayName || "",
        fullName: settings.fullName || "",
        shortDescription: settings.shortDescription || "",
        url: settings.url || "",
        start: settings.start || "",
        end: settings.end || "",
        visibility: settings.visibility || "HIDDEN",
        cardImageUrl: settings.cardImageUrl || "",
        bannerImageUrl: settings.bannerImageUrl || "",
        documentationUrl: settings.documentationUrl || "",
        notebookUrl: settings.notebookUrl || "",
        advancedNotebookUrl: settings.advancedNotebookUrl || "",
        discussionUrl: settings.discussionUrl || "",
        codeUrl: settings.codeUrl || "",
        ruleContentUrl: settings.ruleContentUrl || "",
        prizePoolText: settings.prizePoolText || "",
        prizePoolShortText: settings.prizePoolShortText || "",
        prizePoolUsd: settings.prizePoolUsd || 0,
      });
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsFormData) => {
    saveSettings(data as Competition);
  };

  if (settingsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="competition-name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the competition
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Competition Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full competition name" {...field} />
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
                    <Textarea
                      placeholder="A brief description of the competition"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule & Visibility</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HIDDEN">Hidden</SelectItem>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Images</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cardImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="documentationUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documentation URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notebook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discussionUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discussion URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prize Pool</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="prizePoolText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prize Pool Text</FormLabel>
                    <FormControl>
                      <Input placeholder="$10,000 in prizes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prizePoolUsd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prize Pool USD</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saveSettingsLoading}>
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
