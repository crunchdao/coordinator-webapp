"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  Spinner,
  Textarea,
  toast,
} from "@crunch-ui/core";
import { Download, Export } from "@crunch-ui/icons";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useSettingsHubSync } from "@/modules/competition/application/hooks/useSettingsHubSync";
import { settingsSchema, SettingsFormData } from "../domain/schemas";
import { useCompetitionEnvironments } from "../application/hooks/useCompetitionEnvironments";
import {
  useCompetitionSettings,
  useSaveCompetitionSettings,
} from "../application/hooks/useCompetitionSettings";

export function SettingsForm() {
  const { crunchName } = useCrunchContext();
  const { environments } = useCompetitionEnvironments(crunchName);

  const { settings, settingsLoading } = useCompetitionSettings(crunchName);
  const { saveSettings, saveSettingsAsync, saveSettingsLoading } =
    useSaveCompetitionSettings(crunchName);

  const { pullFromHub, pushToHub, isPulling, isPushing } =
    useSettingsHubSync();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      displayName: "",
      fullName: "",
      shortDescription: "",
      url: "",
      start: "",
      end: "",
      visibility: "HIDDEN",
      cardImageUrl: "",
      bannerImageUrl: "",
      documentationUrl: "",
      notebookUrl: "",
      advancedNotebookUrl: "",
      discussionUrl: "",
      codeUrl: "",
      ruleContentUrl: "",
      prizePoolText: "",
      prizePoolShortText: "",
      prizePoolUsd: 0,
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
    saveSettings(data);
  };

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      const hubSettings = await pullFromHub(address, hubUrl);
      await saveSettingsAsync(hubSettings);
      toast({ title: `Settings pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull settings",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      const values = form.getValues();
      await pushToHub(address, hubUrl, values);
      await saveSettingsAsync(values);
      toast({ title: `Settings pushed to "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to push settings",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const pullableEnvs = environments
    ? Object.entries(environments).filter(
        ([, env]) => env.hubUrl && env.address
      )
    : [];

  if (settingsLoading) {
    return <Spinner className="mx-auto" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Configure the competition metadata displayed on the Hub.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <div className="flex justify-end gap-2">
              {pullableEnvs.length > 0 && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPulling}
                      >
                        <Download />
                        Pull from Hub
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {pullableEnvs.map(([name, env]) => (
                        <DropdownMenuItem
                          key={name}
                          onClick={() =>
                            handlePullFromHub(name, env.address, env.hubUrl!)
                          }
                        >
                          {name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPushing}
                      >
                        <Export />
                        Push to Hub
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {pullableEnvs.map(([name, env]) => (
                        <DropdownMenuItem
                          key={name}
                          onClick={() =>
                            handlePushToHub(name, env.address, env.hubUrl!)
                          }
                        >
                          {name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <Button type="submit" loading={saveSettingsLoading}>
                Save Local
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
