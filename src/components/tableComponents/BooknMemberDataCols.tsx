"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IBook } from "@/lib/models/book.model";
import { IMember } from "@/lib/models/member.model";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { onDeleteBook } from "@/components/EditBookDialog";
import { onDeleteMember } from "@/components/displayAndInput/MemberForm";
import { selectColumn } from "./SelectColumn";
import { sortableColumnHeader } from "./SortableColumnHeader";

export const booksColumns: ColumnDef<Partial<IBook>>[] = [
  ...selectColumn<Partial<IBook>>(),
  {
    accessorKey: "title",
    header: sortableColumnHeader("Book Title"),
  },
  {
    accessorKey: "availableNumOfCopies",
    header: sortableColumnHeader("Available"),
    cell: ({ row }) => {
      const available = row.original.availableNumOfCopies;
      return (
        <span
          className={clsx(
            "text-sm font-medium", // Base styles
            {
              "text-red-600": available !== undefined && available < 3, // Red text if below 3
              "text-gray-800": available && available >= 3, // Gray text if 3 or more
            }
          )}
        >
          {available}
        </span>
      );
    },
  },
  {
    accessorKey: "author",
    header: sortableColumnHeader("Author"),
  },
  {
    accessorKey: "publisher",
    header: sortableColumnHeader("Publisher"),
  },
  {
    accessorKey: "genre",
    header: sortableColumnHeader("Genre"),
  },
  {
    accessorKey: "isbnNo",
    header: "ISBN",
  },
  {
    accessorKey: "numOfPages",
    header: sortableColumnHeader("Pages"),
  },
  {
    accessorKey: "totalNumOfCopies",
    header: sortableColumnHeader("Total"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DeleteConfirmationDialog
            onlyIcon
            onConfirm={() => onDeleteBook(row.original.id!)}
          />
        </div>
      );
    },
  },
];

export const memberColumns: ColumnDef<Partial<IMember>>[] = [
  ...selectColumn<Partial<IMember>>(),
  { accessorKey: "name", header: sortableColumnHeader("User Name") },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={role === "admin" ? "default" : "outline"} // 'default' for admin, 'outline' for user
        >
          {role}
        </Badge>
      );
    },
  },
  { accessorKey: "age", header: sortableColumnHeader("Age") },
  { accessorKey: "email", header: sortableColumnHeader("Email") },
  { accessorKey: "phoneNumber", header: sortableColumnHeader("Phone") },
  { accessorKey: "address", header: sortableColumnHeader("Address") },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DeleteConfirmationDialog
            onlyIcon
            onConfirm={() => onDeleteMember(row.original.id!)}
          />
        </div>
      );
    },
  },
];
