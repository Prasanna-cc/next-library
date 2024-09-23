import { IRepository } from "@/lib/core/repository";
import { IBook } from "@/lib/models/book.model";
import {
  BookSchema,
  BookSchemaBase,
  IBookBase,
} from "@/lib/models/book.schema";
import { IPageRequest, IPagedResponse } from "@/lib/core/pagination";
import { count, eq, like, or, SQL } from "drizzle-orm";
import { db } from "@/lib/database/drizzle/db";
import { Books } from "../database/drizzle/drizzleSchemaMySql";
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
        .$returningId();
      if (result.id) {
        const createdBook = await this.getById(result.id);
        return createdBook;
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
        const [result] = await db
          .update(Books)
          .set(updatedBook)
          .where(eq(Books.id, bookId));
        if (result.affectedRows && result.affectedRows > 0) {
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
        const [result] = await db.delete(Books).where(eq(Books.id, bookId));
        if (result.affectedRows && result.affectedRows > 0) {
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
      const search = `%${params.search.toLowerCase()}%`;
      searchWhereClause = or(
        like(Books.id, search),
        like(Books.title, search),
        like(Books.isbnNo, search),
        like(Books.genre, search),
        like(Books.author, search),
        like(Books.publisher, search)
      );
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
