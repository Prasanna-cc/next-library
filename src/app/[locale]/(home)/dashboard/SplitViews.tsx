"use client";

import BookDrawer from "@/components/librarySpecificComponents/BookDrawer";
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
import { CustomCard } from "@/components/librarySpecificComponents/adminComponents/GeneralCard";
import { IMember } from "@/lib/models/member.model";
import { IProfessor } from "@/lib/models/professor.model";

export type AllowedDataTypes = IBook | IMember | IProfessor;

interface SizeControl {
  minSize?: number;
  defaultSize?: number;
}

interface Props<T extends AllowedDataTypes> {
  // columns: ColumnDef<Partial<T>>[];
  // data: T[];
  // currentPage: number;
  // totalPages: number;
  // defaultTableColumns: string[];
  firstView: React.ReactNode;
  secondView: React.ReactNode;
  mobileView?: React.ReactNode;
  firstViewSize?: SizeControl;
  secondViewSize?: SizeControl;
}
export const SplitViews = <T extends AllowedDataTypes>({
  // columns,
  // data,
  // totalPages,
  // currentPage,
  // defaultTableColumns,
  firstView,
  secondView,
  mobileView,
  firstViewSize,
  secondViewSize,
}: Props<T>) => {
  // const [selectedRow, setSelectedRow] = useState<T | null>(null);
  // const selectOnRowClick = (data: T) => setSelectedRow(data);
  return (
    <div>
      {/* For medium and larger screens */}
      <div className="hidden md:flex ">
        <ResizablePanelGroup direction="horizontal">
          {/* Table Panel */}
          <ResizablePanel
            minSize={firstViewSize?.minSize ?? 50}
            defaultSize={firstViewSize?.defaultSize ?? 60}
          >
            {/* <Suspense fallback={<TableSkeleton cols={2} />}>
              <DataTable
                currentPage={currentPage}
                totalPages={totalPages}
                data={data}
                onRowClick={selectOnRowClick}
                columns={columns}
                defaultVisibleColumns={defaultTableColumns}
              />
            </Suspense> */}
            {firstView}
          </ResizablePanel>

          {/* Handle for resizing */}
          <ResizableHandle withHandle className="bg-gray-300" />

          {/* Preview Panel */}
          <ResizablePanel
            className="flex justify-center items-center bg-slate-100"
            minSize={secondViewSize?.minSize}
            defaultSize={secondViewSize?.defaultSize ?? 40}
          >
            {/* <div className="p-4 w-full h-full overflow-y-scroll no-scrollbar flex justify-center items-center"> */}
            {secondView}
            {/* </div> */}
            {/* {selectedRow ? (
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
              )} */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* For mobile screens */}
      <div className="flex md:hidden">
        {/* <Suspense fallback={<TableSkeleton cols={2} />}>
          <DataTable
            currentPage={currentPage}
            totalPages={totalPages}
            data={data}
            onRowClick={selectOnRowClick}
            columns={columns}
            defaultVisibleColumns={defaultTableColumns}
          />
        </Suspense> */}
        {mobileView || firstView}
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
