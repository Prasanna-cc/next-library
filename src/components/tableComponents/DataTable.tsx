"use client";

import React, { ReactNode, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  VisibilityState,
  getSortedRowModel,
  HeaderContext,
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
import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ChevronDown,
} from "lucide-react";
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
import { useTranslations } from "next-intl";
import { IProfessor } from "@/lib/models/professor.model";

interface DataTableProps<T extends AllowedTypes> {
  data: T[];
  columns: ColumnDef<Partial<T>>[];
  onRowClick?: (data: T) => void;
  currentPage: number;
  totalPages: number;
  cardMode?: boolean;
  defaultVisibleColumns?: string[];
}

type AllowedTypes = IBook | IMember | ITransactionTable | IProfessor;

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
  cardMode,
  totalPages,
  defaultVisibleColumns,
}: DataTableProps<T>) => {
  const t = useTranslations("Tables");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const initialVisibility: VisibilityState = {};
      columns.forEach((column) => {
        if ("accessorKey" in column) {
          if (!defaultVisibleColumns)
            initialVisibility[column.accessorKey as string] = true;
          else
            initialVisibility[column.accessorKey as string] =
              defaultVisibleColumns.includes(column.accessorKey as string);
        } else if (column.id) {
          initialVisibility["select"] = true;
          if (!defaultVisibleColumns) initialVisibility[column.id] = true;
          else
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
        {!cardMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:text-black text-xs text-slate-500 focus-visible:ring-0 focus-visible:shadow-none"
              >
                {t("Columns")} <ChevronDown className="ml-1 h-4 w-4" />
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
                      {t(
                        `Headers.${
                          column.id === "availableNumOfCopies"
                            ? "available"
                            : column.id === "numOfPages"
                            ? "pages"
                            : column.id === "totalNumOfCopies"
                            ? "total"
                            : column.id === "phoneNumber"
                            ? "phone"
                            : column.id
                        }`
                      )}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">
            {t("Pagination", { current: currentPage, total: totalPages })}
          </span>
          <Link href={createPageURL(1)}>
            <Button className="px-3 text-slate-500" variant={"ghost"}>
              <ArrowLeftToLine
                className="w-4 h-4"
                aria-disabled={currentPage === 1}
              />
            </Button>
          </Link>
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
          <Link href={createPageURL(totalPages)}>
            <Button className="px-3 text-slate-500" variant={"ghost"}>
              <ArrowRightToLine
                className="w-4 h-4"
                aria-disabled={currentPage === 1}
              />
            </Button>
          </Link>
        </div>
      </div>
      <Table>
        {!cardMode && (
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
        )}
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
