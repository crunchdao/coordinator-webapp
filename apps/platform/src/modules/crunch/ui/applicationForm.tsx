"use client";

import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@crunch-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MdEditor from "@coordinator/ui/src/md-editor";
import { useCreateOrganizerApplication } from "../application/hooks/useCreateOrganizerApplication";
import { FormHelper } from "./formHelper";
import ReCaptcha from "@coordinator/ui/src/recaptcha";

const applicationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  discordUsername: z.string().min(1, "Discord username is required"),
  projectName: z.string().min(1, "Project name is required"),
  goal: z.string().min(10, "Goal must be at least 10 characters"),
  evaluationMethod: z.string().optional(),
  dataSources: z.string().optional(),
  payoutStructure: z.string().optional(),
  timeline: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export const ApplicationForm = () => {
  const { createOrganizerApplication, isLoading } =
    useCreateOrganizerApplication();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldOffsetTop, setFieldOffsetTop] = useState<number>(0);
  const [submittedData, setSubmittedData] =
    useState<ApplicationFormValues | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      discordUsername: "",
      projectName: "",
      goal: "",
      evaluationMethod: "",
      dataSources: "",
      payoutStructure: "",
      timeline: "",
    },
  });

  const onSubmit = (data: ApplicationFormValues) => {
    if (!recaptchaToken) {
      return;
    }
    setSubmittedData(data);
    createOrganizerApplication({
      payload: data,
      reCaptchaResponse: recaptchaToken,
    });
  };

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
    const fieldElement = fieldRefs.current[fieldName];
    if (fieldElement && formRef.current) {
      const formRect = formRef.current.getBoundingClientRect();
      const fieldRect = fieldElement.getBoundingClientRect();
      setFieldOffsetTop(fieldRect.top - formRect.top);
    }
  };

  return (
    <Card className="p-0 flex lg:divide-x">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1 p-8 lg:w-md max-w-full relative"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.name = el;
                  }}
                >
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={() => handleFieldFocus("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.email = el;
                  }}
                >
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      onFocus={() => handleFieldFocus("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discordUsername"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.discordUsername = el;
                  }}
                >
                  <FormLabel>Discord Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={() => handleFieldFocus("discordUsername")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.projectName = el;
                  }}
                >
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onFocus={() => handleFieldFocus("projectName")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.goal = el;
                  }}
                >
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <div
                      onFocus={() => handleFieldFocus("goal")}
                      onBlur={() => setFocusedField(null)}
                    >
                      <MdEditor value={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evaluationMethod"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.evaluationMethod = el;
                  }}
                >
                  <FormLabel>Evaluation Method</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      onFocus={() => handleFieldFocus("evaluationMethod")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataSources"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.dataSources = el;
                  }}
                >
                  <FormLabel>Data Sources</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      onFocus={() => handleFieldFocus("dataSources")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payoutStructure"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.payoutStructure = el;
                  }}
                >
                  <FormLabel>Payout Structure</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      onFocus={() => handleFieldFocus("payoutStructure")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <div
                  ref={(el) => {
                    fieldRefs.current.timeline = el;
                  }}
                >
                  <FormLabel>Timeline</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      onFocus={() => handleFieldFocus("timeline")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3">
            <ReCaptcha onVerify={setRecaptchaToken} />
            <Button
              type="submit"
              loading={isLoading}
              disabled={!recaptchaToken}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <FormHelper focusedField={focusedField} offsetTop={fieldOffsetTop} />
    </Card>
  );
};
