"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Button,
  CardDescription,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { Trash } from "@crunch-ui/icons";
import { useGetOrganizerMembers } from "../application/hooks/useGetOrganizerMembers";
import { useAddOrganizerMember } from "../application/hooks/useAddOrganizerMember";
import { useDeleteOrganizerMember } from "../application/hooks/useDeleteOrganizerMember";
import { useUpdateOrganizerMember } from "../application/hooks/useUpdateOrganizerMember";
import { OrganizerMember, OrganizerMemberRole } from "../domain/types";
import { AddMemberDialog } from "./addMemberDialog";

interface OrganizerMembersProps {
  organizerName: string;
}

export function OrganizerMembers({ organizerName }: OrganizerMembersProps) {
  const { members, membersLoading } = useGetOrganizerMembers(organizerName);
  const { addOrganizerMember, addOrganizerMemberLoading } =
    useAddOrganizerMember(organizerName);
  const { deleteOrganizerMember } = useDeleteOrganizerMember(organizerName);
  const { updateOrganizerMember } = useUpdateOrganizerMember(organizerName);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddMember = async (data: {
    userId: number;
    role: OrganizerMemberRole;
  }) => {
    await addOrganizerMember(data);
    setAddDialogOpen(false);
  };

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
            updateOrganizerMember({
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
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => deleteOrganizerMember(row.original.user.login)}
        >
          <Trash className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {membersLoading ? "Loading..." : `${members.length} member(s)`}
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            Add Member
          </Button>
        </div>

        <DataTable columns={columns} data={members} loading={membersLoading} />
      </div>

      <AddMemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddMember}
        loading={addOrganizerMemberLoading}
      />
    </>
  );
}
