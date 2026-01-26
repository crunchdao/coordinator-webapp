"use client";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle, Plus, Trash } from "@crunch-ui/icons";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateSettings } from "../application/hooks/useUpdateSettings";
import { useGlobalSettings } from "../application/hooks/useGlobalSettings";
import {
  globalSettingsSchema,
  type GlobalSettingsFormData,
} from "../application/schemas/settingsSchema";

interface SettingsFormProps {
  onSuccess?: () => void;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ onSuccess }) => {
  const { settings } = useGlobalSettings();
  const { updateSettings, updateSettingsLoading } = useUpdateSettings();

  const form = useForm<GlobalSettingsFormData>({
    resolver: zodResolver(globalSettingsSchema),
    defaultValues: settings || {
      endpoints: {
        leaderboard: "",
        models: "",
      },
      logs: {
        containerNames: [""],
      },
      multisig: {
        address: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "logs.containerNames" as never,
  });

  useEffect(() => {
    if (
      settings &&
      JSON.stringify(settings) !== JSON.stringify(form.getValues())
    ) {
      form.reset(settings);
    }
  }, [settings, form]);

  const handleSubmit = (data: Partial<GlobalSettingsFormData>) => {
    updateSettings(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="endpoints.leaderboard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Leaderboard Endpoint
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The endpoint path for fetching leaderboard data (e.g.,
                    /reports/leaderboard)
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="/reports/leaderboard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endpoints.models"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Model List Endpoint
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The endpoint path for fetching model list (e.g.,
                    /reports/models)
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="/reports/models" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>
            Container Names
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
              </TooltipTrigger>
              <TooltipContent>
                The names of containers to stream logs from
              </TooltipContent>
            </Tooltip>
          </FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`logs.containerNames.${index}`}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="container-name" {...field} />
                    </FormControl>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Container
            </Button>
          </div>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="multisig.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Multisig Address
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    When set, all transactions will be proposed to this Squads
                    multisig instead of being executed directly. Leave empty for
                    direct execution.
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Multisig address (e.g., SQDS...)"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={updateSettingsLoading}
            loading={updateSettingsLoading}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
