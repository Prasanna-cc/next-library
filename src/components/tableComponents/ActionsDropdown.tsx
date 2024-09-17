"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Assuming you're using ShadCN's dropdown
import { MoreHorizontal } from "lucide-react"; // MoreHorizontal icon from Lucide
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import {
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@radix-ui/react-dropdown-menu";

interface ActionsDropdownProps {
  actions: ReactNode; // Accepts JSX as actions (like buttons)
}

export const ActionsDropdown = ({ actions }: ActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="">
        {/* Wrap passed JSX (actions) inside DropdownMenuItems */}
        <div className="p-1 flex flex-col gap-2">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">Actions</h2>
            <DropdownMenuSeparator className="bg-slate-200" />
          </div>
          {actions}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
