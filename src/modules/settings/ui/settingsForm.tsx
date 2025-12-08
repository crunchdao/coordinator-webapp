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
import { InfoCircle } from "@crunch-ui/icons";
import { useForm } from "react-hook-form";
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
    defaultValues: {
      apiBaseUrl: "",
      endpoints: {
        leaderboard: "",
      },
      container: {
        name: "",
      },
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const handleSubmit = (data: GlobalSettingsFormData) => {
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
          name="apiBaseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                API Base URL
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The base URL for your external API (e.g.,
                    http://localhost:8000)
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="http://localhost:8000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="container.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Container Name
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>
                    The name of the container to stream logs from
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="crunchdao-model-runner-condorgame-benchmarktracker"
                  {...field}
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
