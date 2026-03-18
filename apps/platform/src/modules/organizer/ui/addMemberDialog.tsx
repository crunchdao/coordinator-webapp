"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { useGetUserMapping } from "@/modules/hub/application/hooks/useGetUserMapping";
import { createOrganizerMemberSchema } from "../application/schemas/organizerMemberSchema";
import {
  OrganizerMemberCreateForm,
  OrganizerMemberRole,
} from "../domain/types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OrganizerMemberCreateForm) => Promise<unknown>;
  loading: boolean;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: AddMemberDialogProps) {
  const { userMapping } = useGetUserMapping();

  const usersOptions = useMemo(() => {
    if (!userMapping) return [];
    return Object.entries(userMapping)
      .map(([, login]) => ({
        value: login,
        label: login,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [userMapping]);

  const form = useForm<OrganizerMemberCreateForm>({
    resolver: zodResolver(createOrganizerMemberSchema),
    defaultValues: {
      userId: undefined,
      role: OrganizerMemberRole.STAFF,
    },
  });

  const handleSubmit = async (data: OrganizerMemberCreateForm) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Member</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Combobox
                      options={usersOptions}
                      value={
                        field.value
                          ? userMapping?.[field.value.toString()]
                          : undefined
                      }
                      onChange={(value) => {
                        const selectedUser = Object.entries(
                          userMapping || []
                        ).find(([, login]) => login === value);
                        field.onChange(Number(selectedUser?.[0]));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={OrganizerMemberRole.STAFF}>
                        Staff
                      </SelectItem>
                      <SelectItem value={OrganizerMemberRole.ADMINISTRATOR}>
                        Administrator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
