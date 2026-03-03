"use client";

import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
  Button,
  Spinner,
} from "@crunch-ui/core";
import { Plus, Trash } from "@crunch-ui/icons";
import { environmentTargetSchema } from "@/modules/config/domain/schemas";
import {
  useCompetitionEnvironments,
  useSaveCompetitionEnvironments,
} from "@/modules/config/application/hooks/useCompetitionEnvironments";
import {
  CompetitionEnvironments,
  HUB_URL_OPTIONS,
  DEFAULT_RPC_URLS,
  DEFAULT_HUB_URLS,
} from "@/modules/config/domain/types";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

const envEntrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  target: environmentTargetSchema,
});

const formSchema = z.object({
  environments: z
    .array(envEntrySchema)
    .min(1, "At least one environment is required"),
});

type FormData = z.infer<typeof formSchema>;

function toFormData(environments?: CompetitionEnvironments): FormData {
  if (!environments || Object.keys(environments).length === 0) {
    return {
      environments: [
        {
          name: "",
          target: {
            address: "",
            network: WalletAdapterNetwork.Devnet,
            rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
            hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
          },
        },
      ],
    };
  }
  return {
    environments: Object.entries(environments).map(([name, target]) => ({
      name,
      target: {
        ...target,
        rpcUrl: target.rpcUrl || "",
        hubUrl: target.hubUrl || "",
      },
    })),
  };
}

function toRecord(data: FormData): CompetitionEnvironments {
  const record: CompetitionEnvironments = {};
  for (const entry of data.environments) {
    if (entry.name) {
      record[entry.name] = {
        address: entry.target.address,
        network: entry.target.network,
        rpcUrl: entry.target.rpcUrl || undefined,
        hubUrl: entry.target.hubUrl || undefined,
      };
    }
  }
  return record;
}

export function EnvironmentsEditorContent() {
  const { crunchName } = useCrunchContext();
  const slug = crunchName;

  const { environments, environmentsLoading } =
    useCompetitionEnvironments(slug);
  const { saveEnvironments, saveEnvironmentsLoading } =
    useSaveCompetitionEnvironments(slug);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: toFormData(environments),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "environments",
  });

  useEffect(() => {
    if (environments) {
      form.reset(toFormData(environments));
    }
  }, [environments, form]);

  const onSubmit = (data: FormData) => {
    saveEnvironments(toRecord(data));
  };

  if (environmentsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Environments</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field, index) => {
            const network = form.watch(
              `environments.${index}.target.network`
            );

            return (
              <div key={field.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name={`environments.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1 mr-4">
                        <FormLabel>Environment Name</FormLabel>
                        <FormControl>
                          <Input placeholder="staging" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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

                <div className="grid gap-3 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`environments.${index}.target.address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crunch Address</FormLabel>
                        <FormControl>
                          <Input placeholder="On-chain address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`environments.${index}.target.network`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Network</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const net = value as WalletAdapterNetwork;
                            form.setValue(
                              `environments.${index}.target.rpcUrl`,
                              DEFAULT_RPC_URLS[net] || ""
                            );
                            form.setValue(
                              `environments.${index}.target.hubUrl`,
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
                            <SelectItem value={WalletAdapterNetwork.Devnet}>
                              Devnet
                            </SelectItem>
                            <SelectItem value={WalletAdapterNetwork.Mainnet}>
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
                    name={`environments.${index}.target.rpcUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RPC URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Default: {DEFAULT_RPC_URLS[network] ? "Helius" : "—"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`environments.${index}.target.hubUrl`}
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
            );
          })}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  target: {
                    address: "",
                    network: WalletAdapterNetwork.Devnet,
                    rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
                    hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
                  },
                })
              }
            >
              <Plus className="size-4 mr-2" />
              Add Environment
            </Button>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saveEnvironmentsLoading}>
              Save Environments
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
