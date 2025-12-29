"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
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
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { pitchFormSchema } from "../application/schemas/pitch";
import { PitchFormData, PitchStatus } from "../domain/types";

export function PitchForm() {
  const form = useForm<PitchFormData>({
    resolver: zodResolver(pitchFormSchema),
    defaultValues: {
      displayName: "",
      shortDescription: "",
      status: PitchStatus.VOTING,
      websiteUrl: "",
      discordUrl: "",
      twitterUrl: "",
      externalUrl: "",
      externalUrlText: "",
      slices: [],
    },
  });

  const onSubmit = (data: PitchFormData) => {
    console.log("Pitch form submitted:", data);
  };

  const onSubmitBasicInfo = () => {
    const values = form.getValues();
    console.log("Basic info submitted:", {
      displayName: values.displayName,
      shortDescription: values.shortDescription,
      status: values.status,
    });
  };

  const onSubmitLinks = () => {
    const values = form.getValues();
    console.log("External links submitted:", {
      websiteUrl: values.websiteUrl,
      discordUrl: values.discordUrl,
      twitterUrl: values.twitterUrl,
      externalUrl: values.externalUrl,
      externalUrlText: values.externalUrlText,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pitch display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PitchStatus.VOTING}>Voting</SelectItem>
                        <SelectItem value={PitchStatus.CANCELED}>
                          Canceled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Button type="button" onClick={onSubmitBasicInfo}>
                Save Basic Info
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discordUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://discord.gg/..." 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://twitter.com/..." 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://..." 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalUrlText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Link text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <div className="flex justify-end p-6 pt-0">
              <Button type="button" onClick={onSubmitLinks}>
                Save Links
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </Form>
  );
}