"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Form,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import {
  useLocalCompetitionEnvironments,
  useSaveLocalCompetitionEnvironments,
} from "../application/hooks/useLocalCompetitionEnvironments";
import {
  environmentsFormSchema,
  EnvironmentsFormData,
} from "../domain/schemas";
import { EnvironmentFields, DEFAULT_ENVIRONMENT } from "./environmentFields";

export function EnvironmentsEditor() {
  const { crunchName } = useCrunchContext();

  const { environments, environmentsLoading } =
    useLocalCompetitionEnvironments(crunchName);
  const { saveEnvironments, saveEnvironmentsLoading } =
    useSaveLocalCompetitionEnvironments(crunchName);

  const form = useForm<EnvironmentsFormData>({
    resolver: zodResolver(environmentsFormSchema),
    defaultValues: {
      environments: environments?.length ? environments : [DEFAULT_ENVIRONMENT],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "environments",
  });

  const [openItems, setOpenItems] = useState<string[]>(() =>
    fields.map((f) => f.id)
  );

  useEffect(() => {
    if (fields.length > 0) {
      const lastId = fields[fields.length - 1].id;
      setOpenItems((prev) =>
        prev.includes(lastId) ? prev : [...prev, lastId]
      );
    }
  }, [fields.length]);

  useEffect(() => {
    if (environments) {
      form.reset({
        environments: environments.length
          ? environments
          : [DEFAULT_ENVIRONMENT],
      });
    }
  }, [environments, form]);

  const onSubmit = (data: EnvironmentsFormData) => {
    saveEnvironments(
      data.environments.map((env) => ({
        ...env,
        rpcUrl: env.rpcUrl || undefined,
        hubUrl: env.hubUrl || undefined,
        coordinatorNodeUrl: env.coordinatorNodeUrl || undefined,
      }))
    );
  };

  if (environmentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environments</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Accordion
              type="multiple"
              className="space-y-3"
              value={openItems}
              onValueChange={setOpenItems}
            >
              {fields.map((field, index) => {
                const envName =
                  form.watch(`environments.${index}.name`) ||
                  `Environment ${index + 1}`;

                return (
                  <AccordionItem
                    className="border"
                    key={field.id}
                    value={field.id}
                  >
                    <div className="relative">
                      <AccordionTrigger className="hover:no-underline w-full">
                        <span>{envName}</span>
                      </AccordionTrigger>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-8 top-1/2 -translate-y-1/2"
                          onClick={() => remove(index)}
                        >
                          <Trash className="size-4" />
                        </Button>
                      )}
                    </div>
                    <AccordionContent>
                      <div className="pt-2">
                        <EnvironmentFields
                          form={form}
                          index={index}
                          prefix="environments"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => append(DEFAULT_ENVIRONMENT)}
              >
                <Plus />
                Add Environment
              </Button>
              <Button type="submit" loading={saveEnvironmentsLoading}>
                Save Environments
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
