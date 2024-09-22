import { DataTable } from "@/components/tableComponents/DataTable";
import ToolBar from "@/app/[locale]/(home)/ToolBar";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { transactionColumns } from "@/components/tableComponents/TransactionDataColumns";
import { getTransactions } from "@/lib/actions";
import { authOptions } from "@/lib/authOptions";
import { ITransactionPageRequest } from "@/lib/core/pagination";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BookStatus, RequestStatus } from "@/lib/core/types";
import FilterComponent from "@/components/TransactionFilters";
import OnlyRequestSwitch from "@/components/onlyRequestSwitch";
import Search from "@/components/Search";
import {
  getLocale,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";

async function MyTransactionsPage({
  searchParams,
  params: { locale },
}: {
  searchParams?: {
    query?: string;
    page?: string;
    filter?: BookStatus | RequestStatus;
    onlyRequests?: "true" | undefined;
  };
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${locale}/signin`);

  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const filter = searchParams?.filter || undefined;
  const onlyRequests = searchParams?.onlyRequests;

  const pageRequest: ITransactionPageRequest = {
    id: session.user.id,
    search: query,
    filterBy: filter,
    data: !onlyRequests ? "transactions" : "requests",
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  };
  const { items: transactions, pagination } = (await getTransactions(
    pageRequest
  ))!;

  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const t = await getTranslations("TransactionsPage");

  return (
    <div className="w-full container py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <span className="text-slate-500 text-sm">{t("description")}</span>
      </div>
      <hr />
      <div className="flex flex-col gap-3 justify-between items-center">
        <ToolBar
          firstHalf={<Search placeholder={t("searchPlaceholder")} />}
          secondHalf={
            <>
              <FilterComponent className="max-w-52" />
              <OnlyRequestSwitch />
            </>
          }
          responsive
        />
        {/* <div className="w-full flex gap-2">
          <Search placeholder="Search transactions..." />
          <FilterComponent className="max-w-52" />
        </div> */}
        {/* <div className="w-full flex justify-end">
          <OnlyRequestSwitch />
        </div> */}
        <Suspense fallback={<TableSkeleton cols={5} />}>
          <DataTable
            currentPage={page}
            totalPages={totalPages}
            data={transactions}
            columns={transactionColumns}
            defaultVisibleColumns={[
              "bookTitle",
              "requestStatus",
              "bookStatus",
              "dueDate",
              "actions",
            ]}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default MyTransactionsPage;
