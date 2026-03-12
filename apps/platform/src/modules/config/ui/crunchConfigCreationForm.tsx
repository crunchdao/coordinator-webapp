"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { generateLink } from "@crunch-ui/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import {
  crunchConfigCreationSchema,
  CrunchConfigCreationFormData,
} from "../application/schemas/crunchConfigCreation";
import { useCreateLocalCompetition } from "../application/hooks/useCreateLocalCompetition";
import { useLocalCompetitionList } from "../application/hooks/useLocalCompetitionList";
import { INTERNAL_LINKS } from "@/utils/routes";
import { Competition } from "@/modules/competition/domain/types";
import { EnvironmentFields, DEFAULT_ENVIRONMENT } from "./environmentFields";

export function CrunchConfigCreationForm() {
  const router = useRouter();
  const { slugs } = useLocalCompetitionList();
  const { createCompetition, createCompetitionLoading } =
    useCreateLocalCompetition();

  const form = useForm<CrunchConfigCreationFormData>({
    resolver: zodResolver(
      crunchConfigCreationSchema.refine((data) => !slugs.includes(data.slug), {
        message: "This slug is already taken",
        path: ["slug"],
      })
    ),
    defaultValues: {
      slug: "",
      environments: [
        {
          ...DEFAULT_ENVIRONMENT,
          name: "staging",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "environments",
  });

  const onSubmit = (data: CrunchConfigCreationFormData) => {
    createCompetition(
      {
        slug: data.slug,
        environments: data.environments.map((env) => ({
          ...env,
          rpcUrl: env.rpcUrl || undefined,
          hubUrl: env.hubUrl || undefined,
          coordinatorNodeUrl: env.coordinatorNodeUrl || undefined,
        })),
        settings: {
          name: data.slug,
          displayName: data.slug,
        } as Competition,
      },
      {
        onSuccess: () => {
          router.push(
            generateLink(INTERNAL_LINKS.CRUNCH, { crunchname: data.slug })
          );
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-competition" {...field} />
              </FormControl>
              <FormDescription>
                Lowercase letters, numbers, and hyphens only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Environments</h3>

          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                  >
                    <Trash className="size-4" />
                  </Button>
                )}
              </div>
              <EnvironmentFields
                form={form}
                index={index}
                prefix="environments"
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append(DEFAULT_ENVIRONMENT)}
          >
            <Plus className="size-4 mr-2" />
            Add Environment
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={createCompetitionLoading}>
            Create Crunch
          </Button>
        </div>
      </form>
    </Form>
  );
}
