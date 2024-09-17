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
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const filterOptions = [
  { value: "all", label: "Filter by status", icon: Circle },
  { value: "requested", label: "Requested", icon: BookCopy },
  { value: "issued", label: "Issued", icon: BookCheck },
  { value: "approved", label: "Approved", icon: CircleCheck },
  { value: "rejected", label: "Rejected", icon: XCircle },
  { value: "cancelled", label: "Cancelled", icon: CircleAlert },
  { value: "pending", label: "Pending", icon: BookDashedIcon },
  { value: "returned", label: "Returned", icon: BookDown },
];

interface FilterProps extends React.ComponentPropsWithoutRef<"div"> {}

export default function FilterComponent({ ...delegated }: FilterProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(
    undefined
  );

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
      params.delete("onlyRequests");
    }

    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="w-full flex items-center" {...delegated}>
      <Select value={selectedFilter} onValueChange={handleFilter}>
        <SelectTrigger className="w-full min-w-[135px] rounded-full bg-slate-100 text-slate-500 font-medium">
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
