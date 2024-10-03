import {
  pgTable,
  serial,
  text,
  integer,
  pgEnum,
  unique,
  foreignKey,
} from "drizzle-orm/pg-core";

// Define enums for book status, request status, role, and status in Postgres
export const bookStatusEnum = pgEnum("bookStatus", [
  "pending",
  "issued",
  "returned",
]);
export const requestStatusEnum = pgEnum("requestStatus", [
  "requested",
  "approved",
  "rejected",
]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["verified", "banned"]);

// Books table definition
export const Books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher").notNull(),
  genre: text("genre").notNull(),
  isbnNo: text("isbnNo").unique().notNull(),
  numOfPages: integer("numOfPages").notNull(),
  totalNumOfCopies: integer("totalNumOfCopies").notNull(),
  availableNumOfCopies: integer("availableNumOfCopies").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("imageUrl"),
});

// Members table definition
export const Members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").unique().notNull(),
  phoneNumber: text("phoneNumber").unique().notNull(),
  address: text("address").notNull(),
  password: text("password").unique().notNull(),
  wallet: integer("wallet").default(0).notNull(),
  role: roleEnum("role").notNull().default("user"),
  status: statusEnum("status").notNull().default("verified"),
});

export const Professors = pgTable("Professors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  department: text("department").notNull(),
  shortBio: text("shortBio"),
  eventLink: text("eventLink"),
});

// Transactions table definition
export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookStatus: bookStatusEnum("bookStatus").default("pending"),
  requestStatus: requestStatusEnum("requestStatus").default("requested"),
  dateOfIssue: text("dateOfIssue").notNull(),
  dueDate: text("dueDate").notNull(),
  memberId: integer("memberId")
    .notNull()
    .references(() => Members.id),
  bookId: integer("bookId")
    .notNull()
    .references(() => Books.id),
});
