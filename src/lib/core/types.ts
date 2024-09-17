import { IBook, IBookBase } from "../models/book.model";
import { IMember, IMemberBase } from "../models/member.model";
// import { ITransaction, ITransactionBase } from "../models/transaction.model";

export type BookStatus = "pending" | "issued" | "returned";
export type RequestStatus = "requested" | "approved" | "rejected" | null;

export type Models = IBook | IMember; // | ITransaction;
export type BaseModels = IBookBase | IMemberBase; // | ITransactionBase;

export type ColumnData = string | number | boolean | null;
export type Row = Record<string, ColumnData | ColumnData[]>;
