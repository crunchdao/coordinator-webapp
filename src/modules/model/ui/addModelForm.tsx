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
  Button,
} from "@crunch-ui/core";
import { addModelSchema } from "../application/schemas/addModelSchema";
import { AddModelBody } from "../domain/types";
import { useAddModel } from "../application/hooks/useAddModel";

interface AddModelFormProps {
  onSuccess?: () => void;
}

export const AddModelForm: React.FC<AddModelFormProps> = ({ onSuccess }) => {
  const { addModel, addModelLoading } = useAddModel();
  const form = useForm<AddModelBody>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      name: "",
      desiredState: "",
    },
  });

  const onSubmit = (data: AddModelBody) => {
    addModel(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Model name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Model File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desiredState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired State</FormLabel>
              <FormControl>
                <Input placeholder="active" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" loading={addModelLoading}>
          Add Model
        </Button>
      </form>
    </Form>
  );
};
