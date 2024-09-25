"use client";

import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import {
  booksColumns,
  memberColumns,
} from "@/components/tableComponents/BooknMemberDataCols";
import { DataTable } from "@/components/tableComponents/DataTable";
import { IMember } from "@/lib/models/member.model";
import { Suspense, useState } from "react";
import { SplitViews } from "@/app/[locale]/(home)/dashboard/SplitViews";
import { CustomCard } from "@/components/librarySpecificComponents/adminComponents/GeneralCard";
import { IBook } from "@/lib/models/book.model";

type Props = {
  data: IBook[];
  currentPage: number;
  totalPages: number;
};
export const BookSplitViews = ({ data, totalPages, currentPage }: Props) => {
  const [selectedRow, setSelectedRow] = useState<IBook | null>(null);
  const selectOnRowClick = (data: IBook) => setSelectedRow(data);

  return (
    <SplitViews
      firstView={
        <Suspense fallback={<TableSkeleton cols={2} />}>
          <DataTable
            currentPage={currentPage}
            totalPages={totalPages}
            data={data}
            onRowClick={selectOnRowClick}
            columns={booksColumns}
            defaultVisibleColumns={[
              "select",
              "title",
              "availableNumOfCopies",
              "actions",
            ]}
          />
        </Suspense>
      }
      secondView={
        <div className="p-4 w-full h-full max-h-[540px] overflow-y-scroll no-scrollbar flex justify-center items-center">
          {selectedRow ? (
            <CustomCard data={selectedRow} />
          ) : (
            <div className="min-w-max flex text-sm text-slate-400 flex-col items-center ">
              <p>Select a row</p>
              <p>to view its details here</p>
            </div>
          )}
        </div>
      }
    />
  );
};
