"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
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
} from "@crunch-ui/core";
import {
  updateCompetitionSchema,
  UpdateCompetitionFormData,
} from "../application/schemas/updateCompetition";
import { useUpdateCompetition } from "../application/hooks/useUpdateCompetition";
import { Competition } from "../domain/types";

interface CompetitionEditFormProps {
  competition: Competition;
  competitionIdentifier: string;
  onSuccess?: () => void;
}

export function CompetitionEditForm({
  competition,
  competitionIdentifier,
  onSuccess,
}: CompetitionEditFormProps) {
  const { updateCompetition, isUpdating } = useUpdateCompetition(
    competitionIdentifier,
    onSuccess
  );

  const form = useForm<UpdateCompetitionFormData>({
    resolver: zodResolver(updateCompetitionSchema),
    defaultValues: {
      name: competition.name || "",
      displayName: competition.displayName || "",
      fullName: competition.fullName || "",
      shortDescription: competition.shortDescription || "",
      start: competition.start || "",
      end: competition.end || "",
      visibility: competition.visibility,
      cardImageUrl: competition.cardImageUrl || "",
      bannerImageUrl: competition.bannerImageUrl || "",
      documentationUrl: competition.documentationUrl || "",
      notebookUrl: competition.notebookUrl || "",
      advancedNotebookUrl: competition.advancedNotebookUrl || "",
      discussionUrl: competition.discussionUrl || "",
      codeUrl: competition.codeUrl || "",
      ruleContentUrl: competition.ruleContentUrl || "",
      prizePoolText: competition.prizePoolText || "",
      prizePoolShortText: competition.prizePoolShortText || "",
      prizePoolUsd: competition.prizePoolUsd,
    },
  });

  useEffect(() => {
    form.reset({
      name: competition.name || "",
      displayName: competition.displayName || "",
      fullName: competition.fullName || "",
      shortDescription: competition.shortDescription || "",
      start: competition.start || "",
      end: competition.end || "",
      visibility: competition.visibility,
      cardImageUrl: competition.cardImageUrl || "",
      bannerImageUrl: competition.bannerImageUrl || "",
      documentationUrl: competition.documentationUrl || "",
      notebookUrl: competition.notebookUrl || "",
      advancedNotebookUrl: competition.advancedNotebookUrl || "",
      discussionUrl: competition.discussionUrl || "",
      codeUrl: competition.codeUrl || "",
      ruleContentUrl: competition.ruleContentUrl || "",
      prizePoolText: competition.prizePoolText || "",
      prizePoolShortText: competition.prizePoolShortText || "",
      prizePoolUsd: competition.prizePoolUsd,
    });
  }, [competition, form]);

  const onSubmit = (data: UpdateCompetitionFormData) => {
    updateCompetition(data);
  };

  return (
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
                  <Input placeholder="Full Competition Name" {...field} />
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
                    placeholder="A brief description of the competition..."
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
          <div className="grid gap-4 md:grid-cols-3">
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
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="HIDDEN">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Image displayed on competition cards
                  </FormDescription>
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
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Image displayed on the competition's overview page
                  </FormDescription>
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
                    <Input type="url" placeholder="https://..." {...field} />
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
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="advancedNotebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advanced Notebook URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
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
                    <Input type="url" placeholder="https://..." {...field} />
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
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ruleContentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules Content URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Prize Pool</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="prizePoolText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Pool Text</FormLabel>
                  <FormControl>
                    <Input placeholder="$10,000 in prizes" {...field} />
                  </FormControl>
                  <FormDescription>Full prize description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prizePoolShortText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Pool Short Text</FormLabel>
                  <FormControl>
                    <Input placeholder="$10K" {...field} />
                  </FormControl>
                  <FormDescription>Short version for cards</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prizePoolUsd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Pool (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>Numeric value in USD</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isUpdating}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
