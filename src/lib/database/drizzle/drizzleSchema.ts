import {
  mysqlTable,
  serial,
  varchar,
  int,
  json,
  date,
  mysqlEnum,
  foreignKey,
  unique,
} from "drizzle-orm/mysql-core";

export const Books = mysqlTable("Books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 255 }).unique().notNull(),
  numOfPages: int("numOfPages").notNull(),
  totalNumOfCopies: int("totalNumOfCopies").notNull(),
  availableNumOfCopies: int("availableNumOfCopies").notNull(),
  price: int("price").notNull(),
});

export const Members = mysqlTable("Members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 255 }).unique().notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).unique().notNull(),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  status: mysqlEnum("status", ["verified", "banned"])
    .notNull()
    .default("verified"),
});

export const MemberSessions = mysqlTable("MemberSessions", {
  id: int("id")
    .notNull()
    .references(() => Members.id),
  refreshToken: varchar("refreshToken", { length: 255 }).notNull().unique(),
});

export const Transactions = mysqlTable("Transactions", {
  id: serial("id").primaryKey(),
  bookStatus: mysqlEnum("bookStatus", [
    "pending",
    "issued",
    "returned",
  ]).default("pending"),
  requestStatus: mysqlEnum("requestStatus", [
    "requested",
    "approved",
    "rejected",
  ]).default("requested"),
  dateOfIssue: varchar("dateOfIssue", { length: 255 }).notNull(),
  dueDate: varchar("dueDate", { length: 255 }).notNull(),
  memberId: int("memberId")
    .notNull()
    .references(() => Members.id),
  bookId: int("bookId")
    .notNull()
    .references(() => Books.id),
});

// import {
//   pgTable,
//   serial,
//   text,
//   integer,
//   pgEnum,
//   unique,
//   foreignKey,
// } from "drizzle-orm/pg-core";

// // Define enums for book status, request status, role, and status in Postgres
// const bookStatusEnum = pgEnum("bookStatus", ["pending", "issued", "returned"]);
// const requestStatusEnum = pgEnum("requestStatus", [
//   "requested",
//   "approved",
//   "rejected",
// ]);
// const roleEnum = pgEnum("role", ["user", "admin"]);
// const statusEnum = pgEnum("status", ["verified", "banned"]);

// // Books table definition
// export const Books = pgTable("books", {
//   id: serial("id").primaryKey(),
//   title: text("title").notNull(),
//   author: text("author").notNull(),
//   publisher: text("publisher").notNull(),
//   genre: text("genre").notNull(),
//   isbnNo: text("isbnNo").unique().notNull(),
//   numOfPages: integer("numOfPages").notNull(),
//   totalNumOfCopies: integer("totalNumOfCopies").notNull(),
//   availableNumOfCopies: integer("availableNumOfCopies").notNull(),
//   price: integer("price").notNull(),
// });

// // Members table definition
// export const Members = pgTable("members", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   age: integer("age").notNull(),
//   email: text("email").unique().notNull(),
//   phoneNumber: text("phoneNumber").unique().notNull(),
//   address: text("address").notNull(),
//   password: text("password").unique().notNull(),
//   role: roleEnum("role").notNull().default("user"),
//   status: statusEnum("status").notNull().default("verified"),
// });

// // MemberSessions table definition
// // export const MemberSessions = pgTable("memberSessions", {
// //   id: integer("id")
// //     .notNull()
// //     .references(() => Members.id),
// //   refreshToken: text("refreshToken").notNull().unique(),
// // });

// // Transactions table definition
// export const Transactions = pgTable("transactions", {
//   id: serial("id").primaryKey(),
//   bookStatus: bookStatusEnum("bookStatus").default("pending"),
//   requestStatus: requestStatusEnum("requestStatus").default("requested"),
//   dateOfIssue: text("dateOfIssue").notNull(),
//   dueDate: text("dueDate").notNull(),
//   memberId: integer("memberId")
//     .notNull()
//     .references(() => Members.id),
//   bookId: integer("bookId")
//     .notNull()
//     .references(() => Books.id),
// });
