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
  imageUrl: varchar("imageUrl", { length: 255 }),
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

// export const MemberSessions = mysqlTable("MemberSessions", {
//   id: int("id")
//     .notNull()
//     .references(() => Members.id),
//   refreshToken: varchar("refreshToken", { length: 255 }).notNull().unique(),
// });

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
