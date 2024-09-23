"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  BookCheck,
  BookCopy,
  BookDashedIcon,
  BookDown,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface FilterProps extends React.ComponentPropsWithoutRef<"div"> {}

export default function FilterComponent({ ...delegated }: FilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );
  const r = useTranslations("Tables.TransactionTable.RequestStatus");
  const b = useTranslations("Tables.TransactionTable.BookStatus");
  const t = useTranslations("TransactionsPage");

  const filterOptions = [
    { value: "all", label: t("filterPlaceholder"), icon: Circle },
    { value: "requested", label: r("requested"), icon: CircleDashed },
    { value: "issued", label: b("issued"), icon: BookCheck },
    { value: "approved", label: r("approved"), icon: CircleCheck },
    { value: "rejected", label: r("rejected"), icon: XCircle },
    { value: "cancelled", label: r("cancelled"), icon: CircleAlert },
    { value: "pending", label: b("pending"), icon: BookDashedIcon },
    { value: "returned", label: b("returned"), icon: BookDown },
  ];

  useEffect(() => {
    // Initialize the selected filter based on the URL search params
    const currentFilter = searchParams.get("filter");
    setSelectedFilter(currentFilter || "all");
  }, [searchParams]);

  const handleFilter = (selection: string) => {
    const params = new URLSearchParams(searchParams);

    if (selection === "all") {
      params.delete("filter");
    } else {
      params.set("filter", selection);
      params.delete("page");
      params.delete("onlyRequests");
      params.delete("showDueList");
    }

    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="w-full flex items-center" {...delegated}>
      <Select value={selectedFilter} onValueChange={handleFilter}>
        <SelectTrigger className="w-full min-w-[170px] rounded-full bg-slate-100 text-slate-500 font-medium">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
