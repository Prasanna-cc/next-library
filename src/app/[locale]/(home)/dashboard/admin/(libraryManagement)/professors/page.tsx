import { memberColumns } from "@/components/tableComponents/BooknMemberDataCols";
import { getMembers, getProfessors } from "@/lib/actions";
import { SplitViews } from "@/app/[locale]/(home)/dashboard/SplitViews";
import CustomDialog from "@/components/CustomDialog";
import { Plus } from "lucide-react";
import MemberForm from "@/components/librarySpecificComponents/adminComponents/MemberForm";
import Search from "@/components/Search";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
// import { ProfessorSplitViews } from "./ProfessorsSplitViews";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import ProfessorForm from "@/components/librarySpecificComponents/adminComponents/ProfessorForm";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DataTable } from "@/components/tableComponents/DataTable";
import { Suspense } from "react";
import ProfessorCard from "@/components/librarySpecificComponents/ProfessorCard";
import PaginationComponent from "@/components/Pagination";
import SearchComponent from "@/components/Search";

export default async function ProfessorsPage({
  searchParams,
  params: { locale },
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const session = await getServerSession(authOptions);

  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const { items: professors, pagination } = (await getProfessors({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: query,
  }))!;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const t = await getTranslations("ProfessorsPage");

  const isAdmin = session?.user.role === "admin" ? true : undefined;

  return (
    <div className="w-full px-4 py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manage Professors</h1>
        {/* <span className="text-slate-500 text-sm">{t("description")}</span> */}
      </div>
      <hr />
      <div className="flex flex-col gap-3 justify-between">
        <ToolBar
          firstHalf={<Search placeholder={t("searchPlaceholder")} />}
          secondHalf={
            session?.user.role === "admin" ? (
              <CustomDialog
                triggerText={
                  <span className="flex gap-1 justify-center items-center">
                    <Plus className="w-4 h-4" />
                    {t("addButton")}
                  </span>
                }
                triggerButtonClass="rounded-full"
              >
                <ProfessorForm />
              </CustomDialog>
            ) : (
              ""
            )
          }
        />
        <div className="w-full flex justify-end">
          <PaginationComponent currentPage={page} totalPages={totalPages} />
        </div>
        {/* <Search placeholder="Search members..." />
        <CustomDialog
          triggerText={
            <span className="flex gap-1 justify-center items-center">
              <Plus className="w-4 h-4" />
              Add new member
            </span>
          }
          triggerButtonClass="rounded-full"
        >
          <MemberForm />
        </CustomDialog> */}
        <div className="w-full grid pb-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {professors.map((professor) => (
            <ProfessorCard
              isAdmin={isAdmin}
              key={professor.id}
              // name={professor.name || ""}
              // department={professor.department || ""}
              // email={professor.email || ""}
              details={professor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
