"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ITransactionTable } from "@/lib/models/transaction.model";
import { sortableColumnHeader } from "./SortableColumnHeader";
import { selectColumn } from "./SelectColumn";
import { Badge } from "../ui/badge";
import {
  BookCheck,
  BookDashedIcon,
  BookDown,
  BookX,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  XCircle,
} from "lucide-react";
import {
  AdminActions,
  RequestCancelAction,
  translatedHeader,
  translatedLabel,
} from "./RowActions";

type BadgeVariant =
  | "default"
  | "outline"
  | "destructive"
  | "secondary"
  | null
  | undefined;

const actionsHeader = translatedHeader();

export const transactionColumns: ColumnDef<Partial<ITransactionTable>>[] = [
  ...selectColumn<Partial<ITransactionTable>>(),
  {
    accessorKey: "bookTitle",
    header: sortableColumnHeader("bookTitle"),
  },
  {
    accessorKey: "requestStatus",
    header: sortableColumnHeader("requestStatus"),
    cell: ({ row }) => {
      const requestStatus = row.original.requestStatus;

      let badgeVariant: BadgeVariant = "default";
      let icon;
      if (requestStatus === "requested") {
        badgeVariant = "outline";
        icon = <CircleDashed className="h-4 w-4" />;
      } else if (requestStatus === "approved") {
        badgeVariant = "default";
        icon = <CircleCheck className="h-4 w-4" />;
      } else if (requestStatus === "cancelled") {
        badgeVariant = "secondary";
        icon = <CircleAlert className="h-4 w-4" />;
      } else if (requestStatus === "rejected") {
        badgeVariant = "destructive";
        icon = <XCircle className="h-4 w-4" />;
      }

      return (
        <Badge variant={badgeVariant} className="py-1 px-2">
          <div className="flex gap-1 items-center">
            {icon}
            {requestStatus &&
              translatedLabel(
                "Tables.TransactionTable.RequestStatus",
                requestStatus
              )}
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookStatus",
    header: sortableColumnHeader("bookStatus"),
    cell: ({ row }) => {
      let bookStatus = row.original.bookStatus;

      let badgeVariant: BadgeVariant = "default";
      let icon;
      if (bookStatus === "pending") {
        badgeVariant = "outline";
        icon = <BookDashedIcon className="h-4 w-4" />;
      } else if (bookStatus === "issued") {
        badgeVariant = "default";
        icon = <BookCheck className="h-4 w-4" />;
      } else if (bookStatus === "not issued") {
        badgeVariant = "destructive";
        icon = <BookX className="h-4 w-4" />;
      } else if (bookStatus === "returned") {
        badgeVariant = "default";
        icon = <BookDown className="h-4 w-4" />;
      }

      return (
        <Badge variant={badgeVariant} className="py-1 px-2">
          <div className="flex gap-1 items-center">
            {icon}
            {bookStatus &&
              translatedLabel(
                "Tables.TransactionTable.BookStatus",
                bookStatus === "not issued" ? "notIssued" : bookStatus
              )}
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: sortableColumnHeader("dueDate"),
  },
  {
    accessorKey: "dateOfIssue",
    header: sortableColumnHeader("dateOfIssue"),
  },
  {
    id: "actions",
    header: actionsHeader,
    cell: ({ row }) => {
      const transactionId = row.original.id;
      if (!transactionId) return;
      return (
        row.original.requestStatus === "requested" && (
          <RequestCancelAction id={transactionId} />
        )
      );
    },
  },
];

export const allTransactionColumns: ColumnDef<Partial<ITransactionTable>>[] = [
  ...selectColumn<Partial<ITransactionTable>>(),
  {
    accessorKey: "bookTitle",
    header: sortableColumnHeader("bookTitle"),
  },
  { accessorKey: "memberName", header: sortableColumnHeader("memberName") },
  {
    accessorKey: "requestStatus",
    header: sortableColumnHeader("requestStatus"),
    cell: ({ row }) => {
      const requestStatus = row.original.requestStatus;

      let badgeVariant: BadgeVariant = "default";
      let icon;
      if (requestStatus === "requested") {
        badgeVariant = "outline";
        icon = <CircleDashed className="h-4 w-4" />;
      } else if (requestStatus === "approved") {
        badgeVariant = "default";
        icon = <CircleCheck className="h-4 w-4" />;
      } else if (requestStatus === "cancelled") {
        badgeVariant = "secondary";
        icon = <CircleAlert className="h-4 w-4" />;
      } else if (requestStatus === "rejected") {
        badgeVariant = "destructive";
        icon = <XCircle className="h-4 w-4" />;
      }

      return (
        <Badge variant={badgeVariant} className="py-1 px-2">
          <div className="flex gap-1 items-center">
            {icon}
            {requestStatus &&
              translatedLabel(
                "Tables.TransactionTable.RequestStatus",
                requestStatus
              )}
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookStatus",
    header: sortableColumnHeader("bookStatus"),
    cell: ({ row }) => {
      let bookStatus = row.original.bookStatus;

      let badgeVariant: BadgeVariant = "default";
      let icon;
      if (bookStatus === "pending") {
        badgeVariant = "outline";
        icon = <BookDashedIcon className="h-4 w-4" />;
      } else if (bookStatus === "issued") {
        badgeVariant = "default";
        icon = <BookCheck className="h-4 w-4" />;
      } else if (bookStatus === "not issued") {
        badgeVariant = "destructive";
        icon = <BookX className="h-4 w-4" />;
      } else if (bookStatus === "returned") {
        badgeVariant = "default";
        icon = <BookDown className="h-4 w-4" />;
      }

      return (
        <Badge variant={badgeVariant} className="py-1 px-2">
          <div className="flex gap-1 items-center">
            {icon}
            {bookStatus &&
              translatedLabel(
                "Tables.TransactionTable.BookStatus",
                bookStatus === "not issued" ? "notIssued" : bookStatus
              )}
          </div>
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: sortableColumnHeader("dueDate"),
  },
  {
    accessorKey: "dateOfIssue",
    header: sortableColumnHeader("dateOfIssue"),
  },
  {
    id: "actions",
    header: actionsHeader,
    cell: ({ row }) => {
      const transactionId = row.original.id;
      if (!transactionId) return;

      return (
        <>
          {row.original.requestStatus === "requested" ? (
            <AdminActions id={transactionId} actionType="requestActions" />
          ) : row.original.bookStatus === "issued" ? (
            <AdminActions id={transactionId} actionType="issuedActions" />
          ) : (
            row.original.requestStatus === "approved" &&
            row.original.bookStatus === "pending" && (
              <AdminActions id={transactionId} actionType="approvedActions" />
            )
          )}
        </>
      );
    },
  },
];
