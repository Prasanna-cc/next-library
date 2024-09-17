import { DataTable } from "@/components/tableComponents/DataTable";
import SearchAndPagination from "@/app/[locale]/(home)/SearchAndPagination";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { allTransactionColumns } from "@/components/tableComponents/TransactionDataColumns";
import { getTransactions } from "@/lib/actions";
import { authOptions } from "@/lib/authOptions";
import { ITransactionPageRequest } from "@/lib/core/pagination";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Search from "@/components/Search";
import FilterComponent from "@/components/TransactionFilters";
import { BookStatus, RequestStatus } from "@/lib/core/types";
import OnlyRequestSwitch from "@/components/onlyRequestSwitch";

async function AllTransactionsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    filter?: BookStatus | RequestStatus;
    onlyUnclaimed?: "true" | undefined;
  };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const ITEMS_PER_PAGE = 9;
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const query = searchParams?.query || "";
  const filter = searchParams?.filter || undefined;
  const onlyUnclaimed = searchParams?.onlyUnclaimed;

  const pageRequest: ITransactionPageRequest = {
    id: session.user.id,
    search: query,
    filterBy: filter,
    data: "allTransactions",
    offset: (page - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  };
  const { items: allTransactions, pagination } = (await getTransactions(
    pageRequest
  ))!;

  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);

  return (
    <div className="w-full container py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <span className="text-slate-500 text-sm">
          Manage all user requests for borrowing books in one place. Review,
          approve, or reject borrowing requests and confirm book returns to
          ensure efficient library management.
        </span>
      </div>
      <hr />
      <div className="flex justify-start gap-2">
        <Search placeholder="Search transactions..." />
        <FilterComponent className="max-w-52" />
        {/* <UnclaimedSwitch /> */}
      </div>

      <Suspense fallback={<TableSkeleton cols={5} />}>
        <DataTable
          currentPage={page}
          totalPages={totalPages}
          data={allTransactions}
          columns={allTransactionColumns}
          defaultVisibleColumns={[
            "bookTitle",
            "memberName",
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

export default AllTransactionsPage;
