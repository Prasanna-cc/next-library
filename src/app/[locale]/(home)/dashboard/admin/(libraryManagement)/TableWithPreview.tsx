"use client";

import BookDrawer from "@/components/BookDrawer";
import { DataTable } from "@/components/tableComponents/DataTable";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ColumnDef } from "@tanstack/react-table";
import { Suspense, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { IBook } from "@/lib/models/book.model";
import { CustomCard } from "@/components/displayAndInput/CustomCard";
import { IMember } from "@/lib/models/member.model";

export type AllowedDataTypes = IBook | IMember;

interface Props<T extends AllowedDataTypes> {
  data: T[];
  columns: ColumnDef<Partial<T>>[];
  currentPage: number;
  totalPages: number;
  defaultTableColumns: string[];
}
export const TableWithPreview = <T extends AllowedDataTypes>({
  data,
  columns,
  defaultTableColumns,
  currentPage,
  totalPages,
}: Props<T>) => {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const selectOnRowClick = (data: T) => setSelectedRow(data);
  return (
    <div>
      {/* For medium and larger screens */}
      <div className="hidden md:flex ">
        <ResizablePanelGroup direction="horizontal">
          {/* Table Panel */}
          <ResizablePanel minSize={50} defaultSize={60}>
            <Suspense fallback={<TableSkeleton cols={2} />}>
              <DataTable
                currentPage={currentPage}
                totalPages={totalPages}
                data={data}
                onRowClick={selectOnRowClick}
                columns={columns}
                defaultVisibleColumns={defaultTableColumns}
              />
            </Suspense>
          </ResizablePanel>

          {/* Handle for resizing */}
          <ResizableHandle withHandle className="bg-gray-300" />

          {/* Preview Panel */}
          <ResizablePanel
            className="flex justify-center items-center bg-slate-100"
            defaultSize={40}
          >
            <div className="p-4 w-full h-full max-h-[540px] overflow-y-scroll no-scrollbar flex justify-center items-center">
              {selectedRow ? (
                isBook(selectedRow) ? (
                  <CustomCard data={selectedRow} />
                ) : isMember(selectedRow) ? (
                  <CustomCard data={selectedRow} />
                ) : null
              ) : (
                <div className="min-w-max flex text-sm text-slate-400 flex-col items-center ">
                  <p>Select a row</p>
                  <p>to view its details here</p>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* For mobile screens */}
      <div className="flex md:hidden">
        <Suspense fallback={<TableSkeleton cols={2} />}>
          <DataTable
            currentPage={currentPage}
            totalPages={totalPages}
            data={data}
            onRowClick={selectOnRowClick}
            columns={columns}
            defaultVisibleColumns={defaultTableColumns}
          />
        </Suspense>
      </div>
    </div>
  );
};

export function isBook(data: AllowedDataTypes): data is IBook {
  return (data as IBook).isbnNo !== undefined;
}

export function isMember(data: AllowedDataTypes): data is IMember {
  return (data as IMember).email !== undefined;
}
