import { z } from "zod";

export const MemberBaseSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(3, { message: "Name must be atleast 3 characters long." }),
  age: z
    .number({ message: "Age must be a number." })
    .int()
    .min(12, { message: "Age should be 12 or older" })
    .max(120, { message: "Modern human don't live that long." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be atleast 10 digits long." })
    .max(12, { message: "Phone number cannot be longer than 12 digits." }),
  email: z.string().email("Email should be valid"),
  address: z.string().min(5, {
    message: "Address is too short, must be of minimum 5 characters long.",
  }),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long")
    .regex(/[A-Z]/, "Password should contain a capital letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password should contain a special character"
    ),
  role: z.enum(["user", "admin"], {
    message: "Role must be either 'user' or 'admin'.",
  }),
});

//TODO: status should be in base schema.

export const MemberSchema = MemberBaseSchema.extend({
  id: z.number().int().min(1).optional(),
  status: z
    .enum(["verified", "banned"], {
      message: "Status must be either 'verified' or 'banned'.",
    })
    .optional(),
});

export const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password should be at least 8 characters long")
      .regex(/[A-Z]/, "New password should contain a capital letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "New password should contain a special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type IMemberBase = z.input<typeof MemberBaseSchema>;
export type IMember = z.input<typeof MemberSchema>;
export type IPasswordChange = z.input<typeof PasswordChangeSchema>;
