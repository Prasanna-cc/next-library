import { BookRepository } from "@/lib/bookManagement/book.repository";
import { IRepository } from "@/lib/core/repository";
import {
  ITransaction,
  ITransactionBase,
  ITransactionTable,
} from "@/lib/models/transaction.model";
import { ITransactionBaseSchema } from "@/lib/models/transaction.schema";
import { IBook } from "@/lib/models/book.schema";
import {
  IPagedResponse,
  IPageRequest,
  ITransactionPageRequest,
} from "@/lib/core/pagination";
import {
  Books,
  DrizzleAdapter,
  Members,
  Transactions,
} from "@/lib/database/drizzle/drizzleAdapter";
import { MySql2Database } from "drizzle-orm/mysql2/driver";
import {
  and,
  count,
  eq,
  is,
  isNull,
  like,
  not,
  or,
  sql,
  SQL,
} from "drizzle-orm";
import { AppError } from "../core/appError";

export class TransactionRepository
  implements
    Omit<IRepository<ITransactionBase, ITransaction>, "delete" | "list">
{
  private db: MySql2Database<Record<string, unknown>>;
  private bookRepo: BookRepository = new BookRepository(this.dbManager);
  constructor(private readonly dbManager: DrizzleAdapter) {
    this.db = this.dbManager.getDrizzlePoolDb();
  }

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
        const createdTrxnId = await this.db.transaction(async (trxn) => {
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
        const issuedTransaction = (await this.getById(createdTrxnId))!; //{ id: result.id, ...newTransaction };
        return issuedTransaction;
      } else {
        throw new AppError(
          400,
          "The book is not available or has no available copies."
        );
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw new AppError(400, err.message);
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
        const issued = await this.db
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
        const issued = await this.db
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
        const updated = await this.db.transaction(async (trxn) => {
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
          throw new AppError(400, "This book has already been approved.");
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
        const updated = await this.db.transaction(async (trxn) => {
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
        const updated = await this.db.transaction(async (trxn) => {
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
        const [member] = await this.db
          .select({ role: Members.role })
          .from(Members)
          .where(eq(Members.id, params.id));
        if (member.role === "admin")
          searchWhereClause = and(
            eq(Transactions.bookStatus, "pending"),
            or(
              eq(Transactions.requestStatus, "requested"),
              eq(Transactions.requestStatus, "approved")
            )
          );
      }
      case "allTransactions": {
        const [member] = await this.db
          .select({ role: Members.role })
          .from(Members)
          .where(eq(Members.id, params.id));
        if (member.role === "admin") {
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
      const filterValue = mappedFilterValue
        ? `%${mappedFilterValue.toLowerCase()}%`
        : mappedFilterValue;
      if (!searchWhereClause) {
        if (filterValue)
          searchWhereClause = or(
            like(Transactions.requestStatus, filterValue),
            like(Transactions.bookStatus, filterValue)
          );
        else searchWhereClause = isNull(Transactions.requestStatus);
      } else {
        if (filterValue)
          searchWhereClause = and(
            searchWhereClause,
            or(
              like(Transactions.requestStatus, filterValue),
              like(Transactions.bookStatus, filterValue)
            )
          );
        else
          searchWhereClause = and(
            searchWhereClause,
            isNull(Transactions.requestStatus)
          );
      }
    }
    const customOrder = sql`CASE 
    WHEN ${Transactions.requestStatus} = 'requested' THEN 1
    WHEN ${Transactions.requestStatus} = 'rejected' THEN 2
    WHEN ${Transactions.requestStatus} = 'approved' THEN 3
    ELSE 4
  END`;

    // Execution of queries:
    try {
      let matchedTransactions: ITransactionTable[];
      const transactionDetails = {
        id: Transactions.id,
        bookTitle: Books.title,
        memberName: Members.name,
        requestStatus:
          sql`COALESCE(${Transactions.requestStatus}, 'cancelled')`.as(
            "requestStatus"
          ),
        bookStatus: sql`COALESCE(${Transactions.bookStatus}, 'not issued')`.as(
          "bookStatus"
        ),
        dueDate: Transactions.dueDate,
        dateOfIssue: Transactions.dateOfIssue,
      };
      if (searchWhereClause) {
        matchedTransactions = (await this.db
          .select(transactionDetails)
          .from(Transactions)
          .leftJoin(Books, eq(Transactions.bookId, Books.id))
          .leftJoin(Members, eq(Transactions.memberId, Members.id))
          .where(searchWhereClause)
          .orderBy(customOrder)
          .offset(params.offset)
          .limit(params.limit)) as unknown as ITransactionTable[];
      } else
        matchedTransactions = (await this.db
          .select(transactionDetails)
          .from(Transactions)
          .leftJoin(Books, eq(Transactions.bookId, Books.id))
          .leftJoin(Members, eq(Transactions.memberId, Members.id))
          .orderBy(customOrder)
          .offset(params.offset)
          .limit(params.limit)) as unknown as ITransactionTable[];
      const [totalMatchedBooks] = await this.db
        .select({ count: count() })
        .from(Transactions)
        .leftJoin(Books, eq(Transactions.bookId, Books.id))
        .leftJoin(Members, eq(Transactions.memberId, Members.id))
        .where(searchWhereClause);
      return {
        items: matchedTransactions,
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

  // Helper functions

  async getById(TransactionId: number): Promise<ITransaction | undefined> {
    // Execution of queries:
    try {
      const [selectedTransaction] = await this.db
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
      const [selectedTransaction] = await this.db
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
