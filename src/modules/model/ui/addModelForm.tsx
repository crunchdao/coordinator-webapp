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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { addModelSchema } from "../application/schemas/addModelSchema";
import { AddModelBody, DesiredState } from "../domain/types";
import { useAddModel } from "../application/hooks/useAddModel";

interface AddModelFormProps {
  onSuccess?: () => void;
}

export const AddModelForm: React.FC<AddModelFormProps> = ({ onSuccess }) => {
  const { addModel, addModelLoading } = useAddModel();
  const form = useForm<AddModelBody>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      desired_state: DesiredState.RUNNING,
      model_name: "",
      cruncher_name: "",
      files: [],
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
          name="model_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Model name"
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
          name="cruncher_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cruncher Name (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cruncher name"
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
          name="files"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Model Files</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onChange(files);
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
          name="desired_state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={DesiredState.RUNNING}>Start</SelectItem>
                  <SelectItem value={DesiredState.STOPPED}>Stop</SelectItem>
                </SelectContent>
              </Select>
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
