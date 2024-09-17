import { BookStatus, RequestStatus } from "./types";

export interface IPagedResponse<T> {
  items: T[];
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}

export interface IPageRequest {
  search?: string;
  offset: number;
  limit: number;
}

export interface ITransactionPageRequest extends IPageRequest {
  id: number;
  filterBy?: BookStatus | RequestStatus | "cancelled";
  data: "requests" | "transactions" | "allRequests" | "allTransactions";
}
