"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { ActionsDropdown } from "./ActionsDropdown";
import { toast } from "@/hooks/use-toast";
import {
  cancelRequest,
  approveRequest,
  rejectRequest,
  issueBook,
  returnBook,
} from "@/lib/actions";

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

export const RequestCancelAction = ({ id }: { id: number }) => {
  const [cancelledId, setCancelledId] = useState<number | null>(null);
  const isDisabled = cancelledId === id;
  const t = useTranslations("Tables.TransactionTable.Actions");

  return (
    <ActionsDropdown
      actions={
        <Button
          variant="ghost"
          onClick={() => handleCancel(id, setCancelledId)}
          className="h-6 w-full py-4 hover:bg-red-500 hover:text-white"
          disabled={isDisabled}
        >
          {t("cancel")}
        </Button>
      }
    />
  );
};

export const AdminActions = ({
  id,
  actionType,
}: {
  id: number;
  actionType: "requestActions" | "approvedActions" | "issuedActions";
}) => {
  const [actionId, setActionId] = useState<number | null>(null);
  const isDisabled = actionId === id;
  const t = useTranslations("Tables.TransactionTable.Actions");

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
                {t("approve")}
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleReject(id, setActionId)}
                className="h-6 w-full py-4 hover:bg-red-500 hover:text-white"
                disabled={isDisabled}
              >
                {t("reject")}
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
              {t("confirmIssue")}
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
              {t("confirmReturn")}
            </Button>
          }
        />
      );
    }
  }
};

export const translatedLabel = (nameSpace: string, value: string) => {
  const t = useTranslations(nameSpace);
  return t(value);
};

export const translatedHeader = (other?: { table: string; value: string }) => {
  const Header = () => {
    const t = useTranslations(
      `Tables.${other ? other.table : "TransactionTable.Headers"}`
    );
    return <span>{t(`${other ? other.value : "actions"}`)} </span>;
  };

  return Header;
};
