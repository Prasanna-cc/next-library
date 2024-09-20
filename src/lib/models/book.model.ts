import { Row } from "../core/types";

export interface IBookBase extends Row {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numOfPages: number;
  totalNumOfCopies: number;
  price: number;
  imageUrl: string | null;
}
export interface IBook extends IBookBase {
  id: number;
  availableNumOfCopies: number;
}
