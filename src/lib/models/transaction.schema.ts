import { z } from "zod";

export const ITransactionBaseSchema = z.object({
  memberId: z
    .number({ message: "Member ID should be a number" })
    .int({ message: "Member ID cannot be a decimal number." }),
  bookId: z
    .number({ message: "Book ID should be a number" })
    .int({ message: "Book ID cannot be a decimal number." }),
});

export const ITransactionSchema = ITransactionBaseSchema.extend({
  id: z
    .number({ message: "ID should be a number" })
    .int({ message: "ID cannot be a decimal number." }),
  bookStatus: z.enum(["pending", "issued", "returned"]),
  requestStatus: z.enum(["requested", "approved", "rejected"]),
  dateOfIssue: z.date(),
  dueDate: z.date(),
});

export type ITransactionBase = z.input<typeof ITransactionBaseSchema>;
export type ITransaction = z.input<typeof ITransactionSchema>;
