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
import { IProfessor } from "@/lib/models/professor.model";
import ProfessorCard from "../librarySpecificComponents/ProfessorCard";

export const booksColumns: ColumnDef<Partial<IBook>>[] = [
  ...selectColumn<Partial<IBook>>(),
  {
    accessorKey: "title",
    header: sortableColumnHeader("title"),
  },
  {
    accessorKey: "availableNumOfCopies",
    header: sortableColumnHeader("available"),
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
    header: sortableColumnHeader("author"),
  },
  {
    accessorKey: "publisher",
    header: sortableColumnHeader("publisher"),
  },
  {
    accessorKey: "genre",
    header: sortableColumnHeader("genre"),
  },
  {
    accessorKey: "isbnNo",
    header: translatedHeader({ table: "BooksTable", value: "isbnNo" }),
  },
  {
    accessorKey: "numOfPages",
    header: sortableColumnHeader("pages"),
  },
  {
    accessorKey: "totalNumOfCopies",
    header: sortableColumnHeader("total"),
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
  { accessorKey: "name", header: sortableColumnHeader("name") },
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
  { accessorKey: "age", header: sortableColumnHeader("age") },
  { accessorKey: "email", header: sortableColumnHeader("email") },
  {
    accessorKey: "phoneNumber",
    header: sortableColumnHeader("phone"),
  },
  {
    accessorKey: "address",
    header: sortableColumnHeader("address"),
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

export const professorColumn = (handleEditClick?: () => void) => {
  const professorColumns: ColumnDef<Partial<IProfessor>>[] = [
    // ...selectColumn<Partial<IProfessor>>(),
    {
      id: "cards",
      cell: ({ row }) => {
        const professor = row.original;
        return (
          <ProfessorCard
            editHandler={handleEditClick}
            // name={professor.name || ""}
            // department={professor.department || ""}
            // email={professor.email || ""}
            details={professor}
          />
        );
      },
    },
  ];

  return professorColumns;
};

// export const professorColumns: ColumnDef<Partial<IProfessor>>[] = [
//   // ...selectColumn<Partial<IProfessor>>(),
//   {
//     id: "cards",
//     cell: ({ row }) => {
//       const professor = row.original;
//       return (
//         <ProfessorCard
//           name={professor.name || ""}
//           department={professor.department || ""}
//           email={professor.email || ""}
//         />
//       );
//     },
//   },
// ];
