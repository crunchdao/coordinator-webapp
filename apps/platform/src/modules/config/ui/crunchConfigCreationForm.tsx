"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import {
  HUB_URL_OPTIONS,
  DEFAULT_RPC_URLS,
  DEFAULT_HUB_URLS,
} from "../domain/types";

export function CrunchConfigCreationForm() {
  const router = useRouter();
  const { slugs } = useLocalCompetitionList();
  const { createCompetition, createCompetitionLoading } =
    useCreateLocalCompetition();

  const form = useForm<CrunchConfigCreationFormData>({
    resolver: zodResolver(
      crunchConfigCreationSchema.refine(
        (data) => !slugs.includes(data.slug),
        {
          message: "This slug is already taken",
          path: ["slug"],
        }
      )
    ),
    defaultValues: {
      slug: "",
      environments: [
        {
          name: "staging",
          address: "",
          network: WalletAdapterNetwork.Devnet,
          rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
          hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
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

          {fields.map((field, index) => {
            const network = form.watch(
              `environments.${index}.network`
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
                    name={`environments.${index}.address`}
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
                          defaultValue={field.value}
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
                    name={`environments.${index}.rpcUrl`}
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
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: "",
                address: "",
                network: WalletAdapterNetwork.Devnet,
                rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
                hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
              })
            }
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
