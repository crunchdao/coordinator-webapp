"use client";

import { UseFormReturn } from "react-hook-form";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  FormControl,
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
} from "@crunch-ui/core";
import {
  HUB_URL_OPTIONS,
  DEFAULT_RPC_URLS,
  DEFAULT_HUB_URLS,
} from "../domain/types";

export const DEFAULT_COORDINATOR_NODE_URL = "http://localhost:8000";

export const DEFAULT_ENVIRONMENT = {
  name: "",
  address: "",
  network: WalletAdapterNetwork.Devnet,
  rpcUrl: DEFAULT_RPC_URLS[WalletAdapterNetwork.Devnet] || "",
  hubUrl: DEFAULT_HUB_URLS[WalletAdapterNetwork.Devnet] || "",
  coordinatorNodeUrl: DEFAULT_COORDINATOR_NODE_URL,
};

interface EnvironmentFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  index: number;
  prefix: string;
}

export function EnvironmentFields({
  form,
  index,
  prefix,
}: EnvironmentFieldsProps) {
  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name={`${prefix}.${index}.name`}
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
          name={`${prefix}.${index}.address`}
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
          name={`${prefix}.${index}.network`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const net = value as WalletAdapterNetwork;
                  form.setValue(
                    `${prefix}.${index}.rpcUrl`,
                    DEFAULT_RPC_URLS[net] || ""
                  );
                  form.setValue(
                    `${prefix}.${index}.hubUrl`,
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
          name={`${prefix}.${index}.rpcUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RPC URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${prefix}.${index}.hubUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hub URL</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === "none" ? "" : value)
                }
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

      <FormField
        control={form.control}
        name={`${prefix}.${index}.coordinatorNodeUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coordinator Node URL</FormLabel>
            <FormControl>
              <Input placeholder={DEFAULT_COORDINATOR_NODE_URL} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
