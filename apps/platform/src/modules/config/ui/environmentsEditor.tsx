"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
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
import {
  HUB_URL_OPTIONS,
  DEFAULT_RPC_URLS,
  DEFAULT_HUB_URLS,
} from "../domain/types";

const DEFAULT_ENVIRONMENT = {
  name: "",
  address: "",
  network: WalletAdapterNetwork.Devnet,
  rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
  hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
};

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
              {fields.map((field, index) => {
                const network = form.watch(`environments.${index}.network`);
                const envName =
                  form.watch(`environments.${index}.name`) ||
                  `Environment ${index + 1}`;

                return (
                  <AccordionItem key={field.id} value={field.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>{envName}</span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                            }}
                          >
                            <Trash className="size-4" />
                          </Button>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <FormField
                          control={form.control}
                          name={`environments.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Environment Name</FormLabel>
                              <FormControl>
                                <Input placeholder="staging" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`environments.${index}.address`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Crunch Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="On-chain address"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`environments.${index}.network`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Network</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    const net = value as WalletAdapterNetwork;
                                    form.setValue(
                                      `environments.${index}.rpcUrl`,
                                      DEFAULT_RPC_URLS[net] || ""
                                    );
                                    form.setValue(
                                      `environments.${index}.hubUrl`,
                                      DEFAULT_HUB_URLS[net] || ""
                                    );
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select network" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem
                                      value={WalletAdapterNetwork.Devnet}
                                    >
                                      Devnet
                                    </SelectItem>
                                    <SelectItem
                                      value={WalletAdapterNetwork.Mainnet}
                                    >
                                      Mainnet
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name={`environments.${index}.rpcUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>RPC URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormDescription>
                                  Default:{" "}
                                  {DEFAULT_RPC_URLS[network] ? "Helius" : "—"}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`environments.${index}.hubUrl`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hub URL</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {HUB_URL_OPTIONS.map((option) => (
                                      <SelectItem
                                        key={option.value || "none"}
                                        value={option.value || "none"}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
