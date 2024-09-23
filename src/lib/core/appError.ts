interface DbError {
  duplicate: "email" | "isbnNo";
}

export class AppError extends Error {
  dbError?: DbError;
  constructor(message: string, dbError?: DbError) {
    super(message);
    this.dbError = dbError;
  }
}
