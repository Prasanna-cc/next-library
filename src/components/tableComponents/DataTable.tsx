"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  VisibilityState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IMember } from "@/lib/models/member.schema";
import { IBook } from "@/lib/models/book.model";
import { ITransactionTable } from "@/lib/models/transaction.model";

interface DataTableProps<T extends AllowedTypes> {
  data: T[];
  columns: ColumnDef<Partial<T>>[];
  onRowClick?: (data: T) => void;
  currentPage: number;
  totalPages: number;
  defaultVisibleColumns: string[];
}

type AllowedTypes = IBook | IMember | ITransactionTable;

function isTransactionTable(data: AllowedTypes[]): data is ITransactionTable[] {
  return data.every(
    (item) => (item as ITransactionTable).dateOfIssue !== undefined
  );
}

export const DataTable = <T extends AllowedTypes>({
  data,
  columns,
  onRowClick,
  currentPage,
  totalPages,
  defaultVisibleColumns,
}: DataTableProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const initialVisibility: VisibilityState = {};
      columns.forEach((column) => {
        if ("accessorKey" in column) {
          initialVisibility[column.accessorKey as string] =
            defaultVisibleColumns.includes(column.accessorKey as string);
        } else if (column.id) {
          initialVisibility["select"] = true;
          initialVisibility[column.id] = defaultVisibleColumns.includes(
            column.id
          );
        }
      });
      return initialVisibility;
    }
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const visibleColumns = table.getVisibleLeafColumns();
  const selectedRows = table.getSelectedRowModel().rows;

  // Extract the selected row IDs (assuming each row has an `id` property)
  let selectedRowIds: number[];
  if (selectedRows.every((row) => row.original.id))
    selectedRowIds = selectedRows.map((row) => row.original.id!);

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-end gap-1 items-center bg-slate-100 pr-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:text-black text-xs text-slate-500 focus-visible:ring-0 focus-visible:shadow-none"
              >
                Columns <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        if (isTransactionTable(data)) {
                          column.toggleVisibility(!!value); // Allow unrestricted selection
                          return;
                        }
                        if (value && visibleColumns.length >= 4) {
                          return;
                        }
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <Link href={createPageURL(Math.max(1, currentPage - 1))}>
            <Button className="px-3 text-slate-500" variant={"ghost"}>
              <ArrowLeft
                className="w-4 h-4"
                aria-disabled={currentPage === 1}
              />
            </Button>
          </Link>
          <Link href={createPageURL(Math.min(totalPages, currentPage + 1))}>
            <Button className="px-3 text-slate-500" variant={"ghost"}>
              <ArrowRight
                className="w-4 h-4"
                aria-disabled={currentPage === totalPages}
              />
            </Button>
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-slate-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick?.(row.original as T)}
              className={onRowClick ? "cursor-pointer" : ""}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {table.getRowModel().rows.length === 0 && (
        <div className="flex text-sm text-slate-400 flex-col items-center pt-8">
          <p>No Match found</p>
        </div>
      )}
    </div>
  );
};
