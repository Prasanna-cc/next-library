import { memberColumns } from "@/components/tableComponents/BooknMemberDataCols";
import { getMembers, getProfessors } from "@/lib/actions";
import { SplitViews } from "@/app/[locale]/(home)/dashboard/SplitViews";
import CustomDialog from "@/components/CustomDialog";
import { Plus } from "lucide-react";
import MemberForm from "@/components/librarySpecificComponents/adminComponents/MemberForm";
import Search from "@/components/Search";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import ProfessorForm from "@/components/librarySpecificComponents/adminComponents/ProfessorForm";
import { getScheduledEvents } from "@/lib/fetchSchedule";
import { Link, redirect } from "@/i18n/routing";
import ScheduledEventCards from "./ScheduledEventCards";
import { Button } from "@/components/ui/button";

export default async function SchedulePage({
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
  if (!session || session === null) redirect(`/${locale}/signin`);

  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  // const { items: professors, pagination } = (await getProfessors({
  //   offset: (page - 1) * ITEMS_PER_PAGE,
  //   limit: ITEMS_PER_PAGE,
  //   search: query,
  // }))!;
  // const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const t = await getTranslations("SchedulePage");
  const data = await getScheduledEvents(session?.user.email || "");

  return (
    <div className="w-full min-h-full h-full px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <span className="text-slate-500 text-sm">{t("description")}</span>
      </div>
      <div className="h-full flex flex-col gap-3 justify-between">
        {data.length !== 0 ? (
          <ScheduledEventCards events={data} />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
            <span className="h-full text-sm text-slate-500">
              You have no session scheduled yet...
            </span>
            <Link href={"/dashboard/professors"}>
              <Button>Book a session</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
