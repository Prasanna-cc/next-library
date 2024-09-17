import { DataTable } from "@/components/tableComponents/DataTable";
import SearchAndPagination from "@/app/[locale]/(home)/SearchAndPagination";
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

async function MyTransactionsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    filter?: BookStatus | RequestStatus;
    onlyRequests?: "true" | undefined;
  };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

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

  return (
    <div className="w-full container py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Requests And Transactions</h1>
        <span className="text-slate-500 text-sm">
          See all your pending book requests in one place. Cancel requests that
          are not approved yet. Easily filter by current status of your request
          to find what you are looking for.
        </span>
      </div>
      <hr />
      <div className="flex justify-between items-center">
        <div className="w-full flex gap-2">
          <Search placeholder="Search transactions..." />
          <FilterComponent className="max-w-52" />
        </div>
        <div className="w-full flex justify-end">
          <OnlyRequestSwitch />
        </div>
      </div>
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
  );
}

export default MyTransactionsPage;
