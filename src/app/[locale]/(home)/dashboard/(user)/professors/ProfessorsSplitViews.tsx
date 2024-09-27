"use client";

import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { professorColumn } from "@/components/tableComponents/BooknMemberDataCols";
import { DataTable } from "@/components/tableComponents/DataTable";
import { SplitViews } from "@/app/[locale]/(home)/dashboard/SplitViews";
import { InlineWidget } from "react-calendly";
import { useSession } from "next-auth/react";
import { useState, Suspense } from "react";
import ProfessorForm from "@/components/librarySpecificComponents/adminComponents/ProfessorForm";
import { IProfessor } from "@/lib/models/professor.model";

type Props = {
  data: IProfessor[];
  currentPage: number;
  totalPages: number;
};

export const ProfessorSplitViews = ({
  data,
  totalPages,
  currentPage,
}: Props) => {
  const { data: session } = useSession();
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(
    null
  );
  const [isEdit, setIsEdit] = useState(false);

  const handleRowClick = (professor: IProfessor) => {
    setSelectedProfessor(professor);
    setIsEdit(false);
  };

  const isAdmin = session?.user.role === "admin" ? "admin" : undefined;

  const renderSecondView = () => {
    if (!selectedProfessor) {
      return (
        <div className="min-w-max flex flex-col items-center text-sm text-slate-400">
          <p>Select a Professor to view their sessions here</p>
        </div>
      );
    }

    if (isEdit) {
      return (
        <div>
          <ProfessorForm
            handleBack={() => setIsEdit(false)}
            professorData={selectedProfessor}
          />
        </div>
      );
    }

    if (selectedProfessor.eventLink) {
      return (
        <div className="w-full h-full">
          <InlineWidget
            url={selectedProfessor.eventLink}
            prefill={{
              name: session?.user.name || "",
              email: session?.user.email || "",
            }}
            pageSettings={{
              backgroundColor: "ffffff",
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: "000000",
              textColor: "64748b",
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-w-max flex flex-col items-center text-sm text-slate-400">
        <p>{selectedProfessor.name}</p>
        <p>has not set an event yet {":("}</p>
      </div>
    );
  };

  return (
    <SplitViews
      firstViewSize={{ minSize: 34, defaultSize: 34 }}
      secondViewSize={{ minSize: 30, defaultSize: 66 }}
      firstView={
        <Suspense fallback={<TableSkeleton cols={2} />}>
          <DataTable
            currentPage={currentPage}
            totalPages={totalPages}
            data={data}
            onRowClick={handleRowClick}
            columns={professorColumn(isAdmin)}
            cardMode
          />
        </Suspense>
      }
      secondView={renderSecondView()}
      mobileView={
        <Suspense fallback={<TableSkeleton cols={2} />}>
          <DataTable
            currentPage={currentPage}
            totalPages={totalPages}
            data={data}
            onRowClick={handleRowClick}
            columns={professorColumn(isAdmin, "mobileView")}
            cardMode
          />
        </Suspense>
      }
    />
  );
};
