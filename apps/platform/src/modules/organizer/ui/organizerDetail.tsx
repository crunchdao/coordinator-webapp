"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from "@crunch-ui/core";
import { useGetOrganizer } from "../application/hooks/useGetOrganizer";
import { useUpdateOrganizer } from "../application/hooks/useUpdateOrganizer";
import { updateOrganizerSchema } from "../application/schemas/updateOrganizerSchema";
import type { OrganizerUpdateForm } from "../domain/types";

interface OrganizerDetailProps {
  organizerName: string;
}

export function OrganizerDetail({ organizerName }: OrganizerDetailProps) {
  const { organizer, organizerLoading } = useGetOrganizer(organizerName);
  const { updateOrganizer, updateOrganizerLoading } =
    useUpdateOrganizer(organizerName);

  const form = useForm<OrganizerUpdateForm>({
    resolver: zodResolver(updateOrganizerSchema),
    defaultValues: {
      displayName: "",
      onChainId: "",
      logoImageUrl: "",
      bannerImageUrl: "",
    },
  });

  useEffect(() => {
    if (organizer) {
      form.reset({
        displayName: organizer.displayName,
        onChainId: organizer.onChainId ?? "",
        logoImageUrl: organizer.logoImageUrl ?? "",
        bannerImageUrl: organizer.bannerImageUrl ?? "",
      });
    }
  }, [organizer, form]);

  if (organizerLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground text-center">
          Organization not found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {organizer.logoImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={organizer.logoImageUrl}
            alt=""
            className="size-12 rounded-full border-2 border-background shrink-0"
          />
        )}

        <CardTitle>{organizer.displayName}</CardTitle>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => updateOrganizer(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="onChainId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On-Chain ID</FormLabel>
                <FormControl>
                  <Input placeholder="On-chain identifier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="logoImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
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
                  <FormLabel>Banner URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={updateOrganizerLoading}
              disabled={!form.formState.isDirty}
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
