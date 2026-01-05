"use client";

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
import { registrationSchema } from "../application/schemas/registration";
import { RegistrationFormData } from "../domain/types";
import { useRegisterCoordinator } from "../application/hooks/useRegisterCoordinator";

export function RegistrationForm() {
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      organizationName: "",
    },
  });

  const { registerCoordinator, registerCoordinatorLoading } = useRegisterCoordinator();

  const onSubmit = (data: RegistrationFormData) => {
    registerCoordinator(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={registerCoordinatorLoading}>
          Create Coordinator Account
        </Button>
      </form>
    </Form>
  );
}