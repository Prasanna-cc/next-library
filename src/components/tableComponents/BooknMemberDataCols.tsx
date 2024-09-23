"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IBook } from "@/lib/models/book.model";
import { IMember } from "@/lib/models/member.model";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { onDeleteBook } from "@/components/librarySpecificComponents/adminComponents/EditBookDialog";
import { onDeleteMember } from "@/components/librarySpecificComponents/adminComponents/MemberForm";
import { selectColumn } from "./SelectColumn";
import { sortableColumnHeader } from "./SortableColumnHeader";
import { translatedHeader, TranslatedLabel } from "./RowActions";

export const booksColumns: ColumnDef<Partial<IBook>>[] = [
  ...selectColumn<Partial<IBook>>(),
  {
    accessorKey: "title",
    header: sortableColumnHeader("title", "books"),
  },
  {
    accessorKey: "availableNumOfCopies",
    header: sortableColumnHeader("available", "books"),
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
    header: sortableColumnHeader("author", "books"),
  },
  {
    accessorKey: "publisher",
    header: sortableColumnHeader("publisher", "books"),
  },
  {
    accessorKey: "genre",
    header: sortableColumnHeader("genre", "books"),
  },
  {
    accessorKey: "isbnNo",
    header: translatedHeader({ table: "BooksTable", value: "isbnNo" }),
  },
  {
    accessorKey: "numOfPages",
    header: sortableColumnHeader("pages", "books"),
  },
  {
    accessorKey: "totalNumOfCopies",
    header: sortableColumnHeader("total", "books"),
  },
  {
    id: "actions",
    header: translatedHeader(),
    cell: ({ row }) => {
      return (
        <DeleteConfirmationDialog
          onlyIcon
          disabled={
            row.original.availableNumOfCopies !== row.original.totalNumOfCopies
          }
          onConfirm={() => onDeleteBook(row.original.id!)}
        />
      );
    },
  },
];

export const memberColumns: ColumnDef<Partial<IMember>>[] = [
  ...selectColumn<Partial<IMember>>(),
  { accessorKey: "name", header: sortableColumnHeader("name", "members") },
  {
    accessorKey: "role",
    header: translatedHeader({ table: "MembersTable", value: "role" }),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={role === "admin" ? "default" : "outline"} // 'default' for admin, 'outline' for user
        >
          {role && (
            <TranslatedLabel
              nameSpace="Tables.MembersTable.Role"
              value={role}
            />
          )}
        </Badge>
      );
    },
  },
  { accessorKey: "age", header: sortableColumnHeader("age", "members") },
  { accessorKey: "email", header: sortableColumnHeader("email", "members") },
  {
    accessorKey: "phoneNumber",
    header: sortableColumnHeader("phone", "members"),
  },
  {
    accessorKey: "address",
    header: sortableColumnHeader("address", "members"),
  },
  {
    id: "actions",
    header: translatedHeader(),
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
