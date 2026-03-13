"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@crunch-ui/core";
import { Trash } from "@crunch-ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetOrganizerMembers } from "../application/hooks/useGetOrganizerMembers";
import {
  addOrganizerMember,
  deleteOrganizerMember,
  updateOrganizerMember,
} from "../infrastructure/service";
import {
  OrganizerMember,
  OrganizerMemberRole,
} from "../domain/types";
import { AddMemberDialog } from "./addMemberDialog";

interface OrganizerMembersProps {
  organizerName: string;
}

export function OrganizerMembers({ organizerName }: OrganizerMembersProps) {
  const queryClient = useQueryClient();
  const { members, membersLoading } = useGetOrganizerMembers(organizerName);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["organizer-members", organizerName],
    });

  const { mutate: removeMember } = useMutation({
    mutationFn: (userLogin: string) =>
      deleteOrganizerMember(organizerName, userLogin),
    onSuccess: () => {
      invalidate();
      toast({ title: "Member removed" });
    },
    onError: () => {
      toast({ title: "Failed to remove member", variant: "destructive" });
    },
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: ({
      userLogin,
      role,
    }: {
      userLogin: string;
      role: OrganizerMemberRole;
    }) => updateOrganizerMember(organizerName, userLogin, { role }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Role updated" });
    },
    onError: () => {
      toast({ title: "Failed to update role", variant: "destructive" });
    },
  });

  const { mutateAsync: addMember, isPending: addingMember } = useMutation({
    mutationFn: (data: { userId: number; role: OrganizerMemberRole }) =>
      addOrganizerMember(organizerName, data),
    onSuccess: () => {
      invalidate();
      toast({ title: "Member added" });
      setAddDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to add member", variant: "destructive" });
    },
  });

  const columns: ColumnDef<OrganizerMember>[] = [
    {
      accessorKey: "user.login",
      header: "User",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.user.login}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Select
          value={row.original.role}
          onValueChange={(v) =>
            changeRole({
              userLogin: row.original.user.login,
              role: v as OrganizerMemberRole,
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={OrganizerMemberRole.STAFF}>Staff</SelectItem>
            <SelectItem value={OrganizerMemberRole.ADMINISTRATOR}>
              Administrator
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => removeMember(row.original.user.login)}
        >
          <Trash className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {membersLoading
                  ? "Loading..."
                  : `${members.length} member(s)`}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={members}
            loading={membersLoading}
          />
        </CardContent>
      </Card>

      <AddMemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addMember}
        loading={addingMember}
      />
    </>
  );
}
