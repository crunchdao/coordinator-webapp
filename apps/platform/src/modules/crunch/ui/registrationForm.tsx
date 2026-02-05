"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@crunch-ui/core";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { registrationSchema } from "../application/schemas/registration";
import { CoordinatorStatus, RegistrationFormData } from "../domain/types";
import { useRegisterCoordinator } from "../application/hooks/useRegisterCoordinator";
import { useGetCoordinator } from "../application/hooks/useGetCoordinator";
import { OnboardingWaitingApproval } from "@/modules/onboarding/ui/onboardingWaitingApproval";

export function RegistrationForm() {
  const { coordinator } = useGetCoordinator();
  const { registerCoordinator, registerCoordinatorLoading } =
    useRegisterCoordinator();
  const { coordinatorStatus, isCheckingCoordinator } = useAuth();

  const organizationName = coordinator?.data?.name;
  const isPending = coordinatorStatus === CoordinatorStatus.PENDING;
  const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  useEffect(() => {
    if (organizationName) {
      form.reset({ organizationName });
    }
  }, [organizationName, form]);

  const onSubmit = (data: RegistrationFormData) => {
    registerCoordinator(data);
  };

  if (isPending || isApproved) {
    return <OnboardingWaitingApproval />;
  }

  const isDisabled =
    coordinatorStatus !== CoordinatorStatus.UNREGISTERED ||
    isCheckingCoordinator;

  return (
    <Form {...form}>
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isDisabled}
                  placeholder="Enter your organization name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="ml-auto block"
          disabled={isDisabled}
          type="submit"
          loading={registerCoordinatorLoading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
}
