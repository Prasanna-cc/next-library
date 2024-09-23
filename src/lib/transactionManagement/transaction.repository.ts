import { BookRepository } from "@/lib/bookManagement/book.repository";
import { IRepository } from "@/lib/core/repository";
import {
  ITransaction,
  ITransactionBase,
  ITransactionTable,
} from "@/lib/models/transaction.model";
import { ITransactionBaseSchema } from "@/lib/models/transaction.schema";
import { IBook } from "@/lib/models/book.schema";
import { IPagedResponse, ITransactionPageRequest } from "@/lib/core/pagination";
import { and, count, eq, isNull, like, not, or, sql, SQL } from "drizzle-orm";
import { AppError } from "../core/appError";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { format } from "date-fns";
import { db } from "../database/drizzle/db";
import {
  Books,
  Members,
  Transactions,
} from "../database/drizzle/drizzleSchemaMySql";

export class TransactionRepository
  implements
    Omit<IRepository<ITransactionBase, ITransaction>, "delete" | "list">
{
  private bookRepo: BookRepository = new BookRepository();

  async create(data: ITransactionBase): Promise<ITransaction | undefined> {
    const validatedData = ITransactionBaseSchema.parse(data);
    try {
      let book = await this.bookRepo.getById(validatedData.bookId);
      if (book && book.availableNumOfCopies > 0) {
        const updatedBook: IBook = {
          ...book,
          availableNumOfCopies: book.availableNumOfCopies - 1,
        };

        const newTransaction: Omit<ITransaction, "id"> = {
          ...validatedData,
          bookStatus: "pending",
          requestStatus: "requested",
          dateOfIssue: "-",
          dueDate: "-",
        };

        // Execution of queries:
        const createdTrxnId = await db.transaction(async (trxn) => {
          await trxn
            .update(Books)
            .set(updatedBook)
            .where(eq(Books.id, updatedBook.id));

          const [result] = await trxn
            .insert(Transactions)
            .values(newTransaction)
            .$returningId();
          return result.id;
        });
        const issuedTransaction = (await this.getById(createdTrxnId))!;
        return issuedTransaction;
      } else {
        throw new AppError(
          "The book is not available or has no available copies."
        );
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw new AppError(err.message);
      }
    }
  }

  async approve(id: number) {
    try {
      const transaction = await this.getById(id);
      if (transaction) {
        if (transaction.bookStatus === "returned") {
          throw new Error("This book has already been returned.");
        }
        const updatedTransaction: Omit<ITransaction, "id"> = {
          ...transaction,
          requestStatus: "approved",
          dateOfIssue: new Date().toDateString(),
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 14)
          ).toDateString(),
        };

        // Execution of queries:
        const issued = await db
          .update(Transactions)
          .set(updatedTransaction)
          .where(eq(Transactions.id, transaction.id));
        if (issued) {
          return updatedTransaction;
        } else throw new Error("Transaction could not be updated");
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  async issue(id: number) {
    try {
      const transaction = await this.getById(id);
      if (transaction) {
        transaction.bookStatus = "issued";

        // Execution of queries:
        const issued = await db
          .update(Transactions)
          .set(transaction)
          .where(eq(Transactions.id, transaction.id));
        if (issued) {
          return transaction;
        } else throw new Error("Transaction could not be updated");
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  async reject(id: number): Promise<ITransaction | undefined> {
    try {
      const transaction = await this.getById(id);
      if (transaction) {
        if (transaction.bookStatus === "issued") {
          throw new Error("This book has already been issued.");
        }

        let book = await this.bookRepo.getById(transaction.bookId);
        if (!book) {
          throw new Error("Book not found.");
        }
        const updatedBook: IBook = {
          ...book,
          availableNumOfCopies: book.availableNumOfCopies + 1,
        };

        transaction.requestStatus = "rejected";
        transaction.bookStatus = null;

        // Execution of queries:
        const updated = await db.transaction(async (trxn) => {
          await trxn
            .update(Books)
            .set(updatedBook)
            .where(eq(Books.id, updatedBook.id));

          const [result] = await trxn
            .update(Transactions)
            .set(transaction)
            .where(eq(Transactions.id, transaction.id));
          return result.affectedRows;
        });
        if (updated) {
          return transaction;
        } else throw new Error("Transaction could not be updated");
      } else {
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  async cancel(id: number): Promise<ITransaction | undefined> {
    try {
      const transaction = await this.getById(id);
      if (transaction) {
        if (transaction.requestStatus === "approved") {
          throw new AppError("This book has already been approved.");
        }

        let book = await this.bookRepo.getById(transaction.bookId);
        if (!book) {
          throw new Error("Book not found.");
        }
        const updatedBook: IBook = {
          ...book,
          availableNumOfCopies: book.availableNumOfCopies + 1,
        };

        transaction.requestStatus = null;
        transaction.bookStatus = null;

        // Execution of queries:
        const updated = await db.transaction(async (trxn) => {
          await trxn
            .update(Books)
            .set(updatedBook)
            .where(eq(Books.id, updatedBook.id));

          const [result] = await trxn
            .update(Transactions)
            .set(transaction)
            .where(eq(Transactions.id, transaction.id));
          return result.affectedRows;
        });
        if (updated) {
          return transaction;
        } else throw new Error("Transaction could not be updated");
      } else {
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  async update(id: number): Promise<ITransaction | undefined> {
    try {
      const transaction = await this.getById(id);
      if (transaction) {
        if (transaction.bookStatus === "returned") {
          throw new Error("This book has already been returned.");
        }

        let book = await this.bookRepo.getById(transaction.bookId);
        if (!book) {
          throw new Error("Book not found.");
        }
        const updatedBook: IBook = {
          ...book,
          availableNumOfCopies: book.availableNumOfCopies + 1,
        };

        transaction.bookStatus = "returned";

        // Execution of queries:
        const updated = await db.transaction(async (trxn) => {
          await trxn
            .update(Books)
            .set(updatedBook)
            .where(eq(Books.id, updatedBook.id));

          const [result] = await trxn
            .update(Transactions)
            .set(transaction)
            .where(eq(Transactions.id, transaction.id));
          return result.affectedRows;
        });
        if (updated) {
          return transaction;
        } else throw new Error("Transaction could not be updated");
      } else {
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }

  async list(
    params: ITransactionPageRequest
  ): Promise<IPagedResponse<ITransactionTable> | null | undefined> {
    let searchWhereClause: SQL | undefined;
    let customOrder = sql`CASE 
    WHEN ${Transactions.requestStatus} = 'approved' THEN 1
    WHEN ${Transactions.requestStatus} = 'rejected' THEN 2
    WHEN ${Transactions.requestStatus} = 'requested' THEN 3
    ELSE 4
  END`;

    switch (params.data) {
      case "requests": {
        searchWhereClause = and(
          or(
            and(
              not(eq(Transactions.bookStatus, "issued")),
              not(eq(Transactions.bookStatus, "returned"))
            ),
            isNull(Transactions.bookStatus)
          ),
          or(
            eq(Transactions.requestStatus, "rejected"),
            eq(Transactions.requestStatus, "requested"),
            eq(Transactions.requestStatus, "approved")
          ),
          eq(Transactions.memberId, Number(params.id))
        );
        break;
      }
      case "transactions": {
        searchWhereClause = eq(Transactions.memberId, Number(params.id));
        break;
      }
      case "allRequests": {
        const [member] = await db
          .select({ role: Members.role })
          .from(Members)
          .where(eq(Members.id, params.id));
        if (member.role === "admin")
          searchWhereClause = and(
            or(
              and(
                not(eq(Transactions.bookStatus, "issued")),
                not(eq(Transactions.bookStatus, "returned"))
              ),
              isNull(Transactions.bookStatus)
            ),
            or(
              eq(Transactions.requestStatus, "rejected"),
              eq(Transactions.requestStatus, "requested"),
              eq(Transactions.requestStatus, "approved")
            )
          );
      }
      case "allTransactions": {
        const [member] = await db
          .select({ role: Members.role })
          .from(Members)
          .where(eq(Members.id, params.id));
        if (member.role === "admin") {
          customOrder = sql`CASE 
          WHEN ${Transactions.requestStatus} = 'requested' THEN 1
          WHEN ${Transactions.requestStatus} = 'approved' THEN 2
          WHEN ${Transactions.requestStatus} = 'rejected' THEN 3
          ELSE 4
          END`;
        }
        // searchWhereClause = not(eq(Transactions.requestStatus, "requested"));
      }
    }
    if (params.search) {
      //TODO: search in books and member table and join that match with the corresponding transaction.
      const searchValue = `%${params.search.toLowerCase()}%`;
      searchWhereClause = and(
        searchWhereClause,
        or(
          like(Books.title, searchValue),
          like(Members.name, searchValue),
          like(Transactions.requestStatus, searchValue),
          like(Transactions.bookStatus, searchValue),
          like(Transactions.dateOfIssue, searchValue),
          like(Transactions.dueDate, searchValue)
        )
      );
    }
    if (params.filterBy) {
      const mappedFilterValue =
        params.filterBy !== "cancelled" ? params.filterBy : null;

      // If mappedFilterValue is null, we directly set the where clause for null requestStatus
      if (!mappedFilterValue) {
        searchWhereClause = searchWhereClause
          ? and(searchWhereClause, isNull(Transactions.requestStatus))
          : isNull(Transactions.requestStatus);
      } else {
        const validRequestStatuses = ["requested", "approved", "rejected"];
        const validBookStatuses = ["pending", "issued", "returned"];

        // Create the appropriate filter based on the mappedFilterValue
        const requestStatusFilter = validRequestStatuses.includes(
          mappedFilterValue
        )
          ? eq(
              Transactions.requestStatus,
              mappedFilterValue as "requested" | "approved" | "rejected"
            )
          : undefined;

        const bookStatusFilter = validBookStatuses.includes(mappedFilterValue)
          ? eq(
              Transactions.bookStatus,
              mappedFilterValue as "pending" | "issued" | "returned"
            )
          : undefined;

        // Set the searchWhereClause based on the available filters
        const newFilter = requestStatusFilter || bookStatusFilter;
        if (newFilter) {
          searchWhereClause = searchWhereClause
            ? and(searchWhereClause, newFilter)
            : newFilter;
        }
      }
    }

    // Execution of queries:
    try {
      let matchedTransactions: ITransactionTable[];
      const transactionDetails = {
        id: Transactions.id,
        bookTitle: Books.title,
        memberName: Members.name,
        requestStatus: Transactions.requestStatus,
        bookStatus: Transactions.bookStatus,
        dueDate: Transactions.dueDate,
        dateOfIssue: Transactions.dateOfIssue,
      };
      if (searchWhereClause) {
        matchedTransactions = (await db
          .select(transactionDetails)
          .from(Transactions)
          .leftJoin(Books, eq(Transactions.bookId, Books.id))
          .leftJoin(Members, eq(Transactions.memberId, Members.id))
          .where(searchWhereClause)
          .orderBy(customOrder)
          .offset(params.offset)
          .limit(params.limit)) as unknown as ITransactionTable[];
      } else
        matchedTransactions = (await db
          .select(transactionDetails)
          .from(Transactions)
          .leftJoin(Books, eq(Transactions.bookId, Books.id))
          .leftJoin(Members, eq(Transactions.memberId, Members.id))
          .orderBy(customOrder)
          .offset(params.offset)
          .limit(params.limit)) as unknown as ITransactionTable[];

      const mappedResults = matchedTransactions.map((transaction) => ({
        ...transaction,
        requestStatus: transaction.requestStatus ?? "cancelled",
        bookStatus: transaction.bookStatus ?? "not issued",
      }));
      const [totalMatchedBooks] = await db
        .select({ count: count() })
        .from(Transactions)
        .leftJoin(Books, eq(Transactions.bookId, Books.id))
        .leftJoin(Members, eq(Transactions.memberId, Members.id))
        .where(searchWhereClause);
      return {
        items: mappedResults,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: totalMatchedBooks.count,
        },
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async dueList(params: Omit<ITransactionPageRequest, "data">) {
    const today = new Date();
    const twoDaysAfterToday = new Date(today);
    twoDaysAfterToday.setDate(today.getDate() + 2);

    // Format dates to match the database format (e.g., 'YYYY-MM-DD')
    const todayFormatted = format(today, "EEE MMM dd yyyy");
    const twoDaysAfterFormatted = format(twoDaysAfterToday, "EEE MMM dd yyyy");

    let searchWhereClause: SQL | undefined = not(
      eq(Transactions.bookStatus, "returned")
    );
    // Build the query conditions
    if (params.role !== "admin") {
      // For non-admins, filter by memberId
      searchWhereClause = and(
        searchWhereClause,
        eq(Transactions.memberId, params.id)
      );
    }
    if (params.search) {
      //TODO: search in books and member table and join that match with the corresponding transaction.
      const searchValue = `%${params.search.toLowerCase()}%`;
      searchWhereClause = and(
        searchWhereClause,
        or(
          like(Books.title, searchValue),
          like(Members.name, searchValue),
          like(Transactions.requestStatus, searchValue),
          like(Transactions.bookStatus, searchValue),
          like(Transactions.dateOfIssue, searchValue),
          like(Transactions.dueDate, searchValue)
        )
      );
    }
    try {
      // Add the due date condition for both admin and non-admin users
      // const dueDateCondition = sql`(Transactions."dueDate" <= ${todayFormatted} OR Transactions."dueDate" <= ${twoDaysAfterFormatted})`;

      // // Combine memberId and dueDate conditions
      // if (searchWhereClause) {
      //   searchWhereClause = sql`${searchWhereClause} AND ${dueDateCondition}`;
      // } else {
      //   searchWhereClause = dueDateCondition;
      // }

      const transactionDetails = {
        id: Transactions.id,
        bookTitle: Books.title,
        memberName: Members.name,
        requestStatus: Transactions.requestStatus,
        bookStatus: Transactions.bookStatus,
        dueDate: Transactions.dueDate,
        dateOfIssue: Transactions.dateOfIssue,
      };

      // Fetch matched transactions with the ordering by dueDate
      const matchedTransactions: ITransactionTable[] = (await db
        .select(transactionDetails)
        .from(Transactions)
        .leftJoin(Books, eq(Transactions.bookId, Books.id))
        .leftJoin(Members, eq(Transactions.memberId, Members.id))
        .where(searchWhereClause)) as unknown as ITransactionTable[];
      // .orderBy(
      //   sql`CASE
      //         WHEN Transactions."dueDate" < ${todayFormatted} THEN 1
      //         WHEN Transactions."dueDate" BETWEEN ${todayFormatted} AND ${twoDaysAfterFormatted} THEN 2
      //         ELSE 3
      //       END`
      // )
      // .offset(params.offset)
      // .limit(params.limit)

      console.log("today: ", today);
      console.log("twoDaysAfterToday: ", twoDaysAfterToday);

      const filteredTransactions = matchedTransactions.filter((transaction) => {
        const dueDate = new Date(transaction.dueDate);
        console.log("dueDate: ", dueDate, " dbDueDate: ", transaction.dueDate);
        // dueDate <= today &&
        return dueDate <= twoDaysAfterToday;
      });
      const mappedResults = filteredTransactions.map((transaction) => ({
        ...transaction,
        requestStatus: transaction.requestStatus ?? "cancelled",
        bookStatus: transaction.bookStatus ?? "not issued",
      }));

      // Count the total matching entries
      // const [totalMatchedBooks] = await db
      //   .select({ count: count() })
      //   .from(Transactions)
      //   .leftJoin(Books, eq(Transactions.bookId, Books.id))
      //   .leftJoin(Members, eq(Transactions.memberId, Members.id))
      //   .where(searchWhereClause);

      // Return the result with pagination
      return {
        items: mappedResults,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: mappedResults.length,
        },
      };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  // Helper functions

  async getById(TransactionId: number): Promise<ITransaction | undefined> {
    // Execution of queries:
    try {
      const [selectedTransaction] = await db
        .select()
        .from(Transactions)
        .where(eq(Transactions.id, TransactionId));
      if (!selectedTransaction)
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      return selectedTransaction;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async getByData(data: ITransactionBase): Promise<ITransaction | undefined> {
    // Execution of queries:
    try {
      const [selectedTransaction] = await db
        .select()
        .from(Transactions)
        .where(
          and(
            eq(Transactions.bookId, data.bookId),
            eq(Transactions.memberId, data.memberId)
          )
        );
      if (!selectedTransaction)
        throw new Error(
          "Transaction not found. Please enter correct transaction ID."
        );
      return selectedTransaction;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
}
