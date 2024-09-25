import { IRepository } from "@/lib/core/repository";
import { IBook } from "@/lib/models/book.model";
import {
  BookSchema,
  BookSchemaBase,
  IBookBase,
} from "@/lib/models/book.schema";
import { IPageRequest, IPagedResponse } from "@/lib/core/pagination";
import { count, eq, ilike, like, or, sql, SQL } from "drizzle-orm";
import { db } from "@/lib/database/drizzle/db";
import { Books } from "@/lib/database/drizzle/drizzleSchema";
import { AppError } from "../core/appError";

export class BookRepository implements IRepository<IBookBase, IBook> {
  async create(newBookdata: IBookBase): Promise<IBook | undefined> {
    let validatedData: Partial<IBook> = BookSchemaBase.parse(newBookdata);
    validatedData = {
      ...validatedData,
      availableNumOfCopies: validatedData.totalNumOfCopies,
    };

    // Execution of queries:
    try {
      const [result] = await db
        .insert(Books)
        .values(validatedData as IBook)
        .returning();
      if (result) {
        return result;
      } else throw new Error("There was a problem while creating the book");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Duplicate entry")) {
          if (err.message.includes("isbnNo")) {
            throw new AppError("Book with this ISBN No. already exists", {
              duplicate: "isbnNo",
            });
          }
        }
        throw new Error(err.message);
      }
    }
  }
  async update(
    bookId: number,
    data: Partial<IBookBase>
  ): Promise<IBook | undefined> {
    // Execution of queries:
    try {
      const oldBook = await this.getById(bookId);
      if (oldBook) {
        const newBook = {
          ...oldBook,
          ...data,
        };
        const validatedBook = BookSchema.parse(newBook);
        const updatedBook: IBook = {
          ...validatedBook,
          imageUrl: validatedBook.imageUrl ?? null,
          availableNumOfCopies:
            validatedBook.totalNumOfCopies -
            (oldBook.totalNumOfCopies - validatedBook.availableNumOfCopies),
        };
        const result = await db
          .update(Books)
          .set(updatedBook)
          .where(eq(Books.id, bookId));
        if (result.rowCount && result.rowCount > 0) {
          return updatedBook;
        } else throw new Error("There was a problem while updating the book");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async delete(bookId: number): Promise<IBook | undefined> {
    // Execution of queries:
    try {
      const deletedBook = await this.getById(bookId);
      if (deletedBook) {
        const result = await db.delete(Books).where(eq(Books.id, bookId));
        if (result.rowCount && result.rowCount > 0) {
          return deletedBook;
        } else throw new Error("There was a problem while deleting the book");
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async getById(bookId: number): Promise<IBook | undefined> {
    // Execution of queries:
    try {
      const [selectedBook] = await db
        .select()
        .from(Books)
        .where(eq(Books.id, bookId));
      if (!selectedBook) throw new Error("Book not found");
      return selectedBook;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }

  async list(params: IPageRequest): Promise<IPagedResponse<IBook> | undefined> {
    let searchWhereClause: SQL | undefined;
    if (params.search) {
      console.log("params.search: ", params.search);

      const search = `${params.search}`;
      searchWhereClause = sql`${Books.title} ILIKE ${`%${params.search}%`}
      OR ${Books.author} ILIKE ${`%${params.search}%`}
      OR ${Books.publisher} ILIKE ${`%${params.search}%`}
      OR ${Books.genre} ILIKE ${`%${params.search}%`}
      OR ${Books.isbnNo} ILIKE ${`%${params.search}%`}`;
      // or(
      //   ilike(Books.id, search),
      //   ilike(Books.title, search),
      //   ilike(Books.isbnNo, search),
      //   ilike(Books.genre, search),
      //   ilike(Books.author, search),
      //   ilike(Books.publisher, search)
      // );
    }

    // Execution of queries:
    try {
      let matchedBooks: IBook[];
      if (searchWhereClause) {
        matchedBooks = await db
          .select()
          .from(Books)
          .where(searchWhereClause)
          .offset(params.offset)
          .limit(params.limit);
      } else {
        matchedBooks = await db
          .select()
          .from(Books)
          .orderBy(Books.id)
          .offset(params.offset)
          .limit(params.limit);
      }
      if (matchedBooks.length !== 0) {
        const [totalMatchedBooks] = await db
          .select({ count: count() })
          .from(Books)
          .where(searchWhereClause);

        return {
          items: matchedBooks,
          pagination: {
            offset: params.offset,
            limit: params.limit,
            total: totalMatchedBooks.count,
          },
        };
      } else
        return {
          items: [],
          pagination: {
            offset: 0,
            limit: 1,
            total: 0,
          },
        };
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    }
  }
}
