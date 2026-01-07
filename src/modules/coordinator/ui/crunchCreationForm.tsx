"use client";

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
} from "@crunch-ui/core";
import { crunchCreationSchema, CreateCrunchFormData } from "../application/schemas/crunchCreation";
import { useCreateCrunch } from "../application/hooks/useCreateCrunch";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "../domain/types";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";

export function CrunchCreationForm() {
  const form = useForm<CreateCrunchFormData>({
    resolver: zodResolver(crunchCreationSchema),
    defaultValues: {
      name: "",
      payoutAmount: 10000,
      maxModelsPerCruncher: 5,
    },
  });

  const router = useRouter();
  const { coordinatorStatus } = useAuth();
  const { createCrunch, createCrunchLoading, createCrunchData } = useCreateCrunch();

  const onSubmit = async (data: CreateCrunchFormData) => {
    createCrunch(data, {
      onSuccess: (result) => {
        // Redirect to the newly created crunch leaderboard
        router.push(
          generateLink(INTERNAL_LINKS.LEADERBOARD, {
            crunchname: result.crunchName,
          })
        );
      },
    });
  };

  const isDisabled = coordinatorStatus !== CoordinatorStatus.APPROVED || createCrunchLoading;

  return (
    <Form {...form}>
      <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crunch Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isDisabled}
                  placeholder="my-awesome-crunch"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A unique identifier for your crunch. Use alphanumeric characters, hyphens, and underscores only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payoutAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Amount (USDC)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isDisabled}
                  placeholder="10000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                Total USDC amount to be distributed as rewards to participants.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxModelsPerCruncher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Models per Cruncher</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={isDisabled}
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormDescription>
                Maximum number of models each participant can submit to this crunch.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            disabled={isDisabled}
            type="submit"
            loading={createCrunchLoading}
          >
            Create Crunch
          </Button>
          {coordinatorStatus !== CoordinatorStatus.APPROVED && (
            <p className="text-sm text-muted-foreground mt-2">
              Only approved coordinators can create crunches.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}