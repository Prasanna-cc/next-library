// "use client";

// import { getTransactions } from "@/lib/actions";
// import { DataTable } from "./tableComponents/DataTable";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import {
//   requestColumns,
//   transactionColumns,
// } from "./tableComponents/TransactionDataColumns";

// export const TransactionsTable = async ({
//   fetchType,
//   limit,
// }: {
//   fetchType: "requests" | "transactions";
//   limit: number;
// }) => {
//   const { data: session } = useSession();
//   if (!session) redirect("signin");

//   const transactions = await getTransactions({
//     id: session.user.id,
//     data: fetchType,
//     limit,
//     offset: 0,
//   });

//   if (!transactions || transactions.items.length === 0) {
//     return <p>No data available.</p>;
//   }
//   return (
//     <DataTable
//       data={transactions.items}
//       columns={fetchType === "requests" ? requestColumns : transactionColumns}
//     />
//   );
// };
