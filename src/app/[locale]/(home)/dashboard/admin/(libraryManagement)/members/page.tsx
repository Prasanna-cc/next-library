import { memberColumns } from "@/components/tableComponents/BooknMemberDataCols";
import { getMembers } from "@/lib/actions";
import { TableWithPreview } from "../TableWithPreview";
import CustomDialog from "@/components/CustomDialog";
import { Plus } from "lucide-react";
import MemberForm from "@/components/librarySpecificComponents/adminComponents/MemberForm";
import Search from "@/components/Search";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function MemberManagementPage({
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
  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const { items: members, pagination } = (await getMembers({
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: query,
  }))!;
  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const t = await getTranslations("MembersPage");

  return (
    <div className="w-full px-4 py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <span className="text-slate-500 text-sm">{t("description")}</span>
      </div>
      <div className="flex flex-col gap-3 justify-between">
        <ToolBar
          firstHalf={<Search placeholder={t("searchPlaceholder")} />}
          secondHalf={
            <CustomDialog
              triggerText={
                <span className="flex gap-1 justify-center items-center">
                  <Plus className="w-4 h-4" />
                  {t("addButton")}
                </span>
              }
              triggerButtonClass="rounded-full"
            >
              <MemberForm />
            </CustomDialog>
          }
        />
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
        <TableWithPreview
          currentPage={page}
          totalPages={totalPages}
          data={members}
          columns={memberColumns}
          defaultTableColumns={["name", "role"]}
        />
      </div>
    </div>
  );
}
