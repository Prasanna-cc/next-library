"use client";

import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  approveRequest,
  cancelRequest,
  issueBook,
  rejectRequest,
  returnBook,
} from "@/lib/actions";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ITransactionTable } from "@/lib/models/transaction.model";
import { ActionsDropdown } from "./ActionsDropdown";
import { sortableColumnHeader } from "./SortableColumnHeader";
import { selectColumn } from "./SelectColumn";

const handleCancel = async (
  transactionId: number,
  setCancelledId: (id: number) => void
) => {
  try {
    const isCancelled = await cancelRequest(transactionId);
    if (isCancelled) {
      toast({
        variant: "default",
        title: "Request Cancelled",
        description: "Your request has been cancelled.",
      });
      setCancelledId(transactionId);
    } else {
      toast({
        variant: "destructive",
        title: "Could not cancel",
        description: "The request has been approved and cannot be cancelled.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Request Failed",
      description: "Something went wrong. Please try again later.",
    });
  }
};

const handleApprove = async (
  transactionId: number,
  setApprovedId: (id: number) => void
) => {
  try {
    const isApproved = await approveRequest(transactionId);
    if (isApproved) {
      toast({
        variant: "default",
        title: "Request Approved",
        description: "Refresh the page to remove this from list.",
      });
      setApprovedId(transactionId);
    } else {
      toast({
        variant: "destructive",
        title: "Could not approve",
        description: "Please try again.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Could not approve",
      description: "Please try again.",
    });
  }
};

const handleReject = async (
  transactionId: number,
  setRejectedId: (id: number) => void
) => {
  try {
    const isRejected = await rejectRequest(transactionId);
    if (isRejected) {
      toast({
        variant: "default",
        title: "Request Rejected",
        description: "Refresh the page to remove this from list.",
      });
      setRejectedId(transactionId);
    } else {
      toast({
        variant: "destructive",
        title: "Could not reject",
        description: "Please try again.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Could not reject",
      description: "Please try again.",
    });
  }
};

const handleIssue = async (
  transactionId: number,
  setIssuedId: (id: number) => void
) => {
  try {
    const isIssued = await issueBook(transactionId);
    if (isIssued) {
      toast({
        variant: "default",
        title: "Book Issued.",
      });
      setIssuedId(transactionId);
    } else {
      toast({
        variant: "destructive",
        title: "Could not issue.",
        description: "Please try again.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Could not issue.",
      description: "Please try again.",
    });
  }
};

const handleReturn = async (
  transactionId: number,
  setReturnedId: (id: number) => void
) => {
  try {
    const isReturned = await returnBook(transactionId);
    if (isReturned) {
      toast({
        variant: "default",
        title: "Book marked as returned.",
      });
      setReturnedId(transactionId);
    } else {
      toast({
        variant: "destructive",
        title: "Could not complete the action.",
        description: "Please try again.",
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Could not complete the action.",
      description: "Please try again.",
    });
  }
};

const RequestCancelAction = ({ id }: { id: number }) => {
  const [cancelledId, setCancelledId] = useState<number | null>(null);
  const isDisabled = cancelledId === id;

  return (
    <ActionsDropdown
      actions={
        <Button
          variant="ghost"
          onClick={() => handleCancel(id, setCancelledId)}
          className="h-6 w-full py-4 hover:bg-red-500 hover:text-white"
          disabled={isDisabled}
        >
          {isDisabled ? "Cancelled" : "Cancel"}
        </Button>
      }
    />
  );
};

export const transactionColumns: ColumnDef<Partial<ITransactionTable>>[] = [
  ...selectColumn<Partial<ITransactionTable>>(),
  {
    accessorKey: "bookTitle",
    header: sortableColumnHeader("Book Title"),
  },
  {
    accessorKey: "requestStatus",
    header: sortableColumnHeader("Request Status"),
  },
  {
    accessorKey: "bookStatus",
    header: sortableColumnHeader("Book Status"),
  },
  {
    accessorKey: "dueDate",
    header: sortableColumnHeader("Due Date"),
  },
  {
    accessorKey: "dateOfIssue",
    header: sortableColumnHeader("Date Of Issue"),
  },
  {
    id: "actions",
    header: "Actions",
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

const AdminActions = ({
  id,
  actionType,
}: {
  id: number;
  actionType: "requestActions" | "approvedActions" | "issuedActions";
}) => {
  const [actionId, setActionId] = useState<number | null>(null);
  const isDisabled = actionId === id;

  switch (actionType) {
    case "requestActions": {
      return (
        <ActionsDropdown
          actions={
            <div className="w-full flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() => handleApprove(id, setActionId)}
                className="h-6 w-full py-4 hover:bg-black hover:text-white"
                disabled={isDisabled}
              >
                Approve
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleReject(id, setActionId)}
                className="h-6 w-full py-4 hover:bg-red-500 hover:text-white"
                disabled={isDisabled}
              >
                Reject
              </Button>
            </div>
          }
        />
      );
    }
    case "approvedActions": {
      return (
        <ActionsDropdown
          actions={
            <Button
              variant="ghost"
              onClick={() => handleIssue(id, setActionId)}
              className="h-6 w-full py-4 hover:bg-black hover:text-white"
              disabled={isDisabled}
            >
              Confirm Issue
            </Button>
          }
        />
      );
    }
    case "issuedActions": {
      return (
        <ActionsDropdown
          actions={
            <Button
              variant="ghost"
              onClick={() => handleReturn(id, setActionId)}
              className="h-6 w-full py-4"
              disabled={isDisabled}
            >
              Confirm Return
            </Button>
          }
        />
      );
    }
  }
};

export const allTransactionColumns: ColumnDef<Partial<ITransactionTable>>[] = [
  ...selectColumn<Partial<ITransactionTable>>(),
  {
    accessorKey: "bookTitle",
    header: sortableColumnHeader("Book Title"),
  },
  { accessorKey: "memberName", header: sortableColumnHeader("User Name") },
  {
    accessorKey: "requestStatus",
    header: sortableColumnHeader("Request Status"),
  },
  {
    accessorKey: "bookStatus",
    header: sortableColumnHeader("Book Status"),
  },
  {
    accessorKey: "dueDate",
    header: sortableColumnHeader("Due Date"),
  },
  {
    accessorKey: "dateOfIssue",
    header: sortableColumnHeader("Date Of Issue"),
  },
  {
    id: "actions",
    header: "Actions",
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
