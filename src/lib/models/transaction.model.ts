import { BookStatus, RequestStatus } from "../core/types";
export interface ITransactionBase {
  memberId: number;
  bookId: number;
}

export interface ITransaction extends ITransactionBase {
  id: number;
  bookStatus: BookStatus | null;
  requestStatus: RequestStatus;
  dateOfIssue: string;
  dueDate: string;
}

export interface ITransactionTable
  extends Omit<ITransaction, "bookId" | "memberId" | "requestStatus"> {
  memberName: string | null;
  bookTitle: string | null;
  requestStatus: RequestStatus | "cancelled";
}
