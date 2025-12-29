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
import { SliceManager } from "./sliceManager";
import { Save } from "@crunch-ui/icons";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pitch</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardTitle>Basic Information</CardTitle>
            <div className="grid gap-3 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter pitch display name"
                        {...field}
                      />
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
            </div>
            <div className="mt-8">
              <SliceManager form={form} />
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" size="lg">
                Save <Save />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
