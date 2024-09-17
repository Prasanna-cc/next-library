import { IRepository } from "../core/repository";
import { IBook } from "../models/book.model";
import { BookSchema, BookSchemaBase, IBookBase } from "../models/book.schema";
import { IPageRequest, IPagedResponse } from "../core/pagination";
import { Books, DrizzleAdapter } from "../database/drizzle/drizzleAdapter";
import { count, eq, like, or, SQL } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2/driver";

export class BookRepository implements IRepository<IBookBase, IBook> {
  private db: MySql2Database<Record<string, unknown>>;
  constructor(private readonly dbManager: DrizzleAdapter) {
    this.db = this.dbManager.getDrizzlePoolDb();
  }

  async create(newBookdata: IBookBase): Promise<IBook | undefined> {
    let validatedData: Partial<IBook> = BookSchemaBase.parse(newBookdata);
    validatedData = {
      ...validatedData,
      availableNumOfCopies: validatedData.totalNumOfCopies,
    };

    // Execution of queries:
    try {
      const [result] = await this.db
        .insert(Books)
        .values(validatedData as IBook)
        .$returningId();
      if (result.id) {
        const createdBook = await this.getById(result.id);
        return createdBook;
      } else throw new Error("There was a problem while creating the book");
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
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
          availableNumOfCopies:
            validatedBook.totalNumOfCopies -
            (oldBook.totalNumOfCopies - validatedBook.availableNumOfCopies),
        };
        const [result] = await this.db
          .update(Books)
          .set(updatedBook)
          .where(eq(Books.id, bookId));
        if (result.affectedRows > 0) {
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
        const [result] = await this.db
          .delete(Books)
          .where(eq(Books.id, bookId));
        if (result.affectedRows > 0) {
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
      const [selectedBook] = await this.db
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
      if (searchWhereClause)
        matchedBooks = await this.db
          .select()
          .from(Books)
          .where(searchWhereClause)
          .offset(params.offset)
          .limit(params.limit);
      else
        matchedBooks = await this.db
          .select()
          .from(Books)
          .offset(params.offset)
          .limit(params.limit);
      if (matchedBooks.length !== 0) {
        const [totalMatchedBooks] = await this.db
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
