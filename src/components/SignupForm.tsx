"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { usePathname, useSearchParams } from "next/navigation";
import { registerMember } from "@/lib/actions";
import { IMemberBase } from "@/lib/models/member.model";
import { Providers } from "@/lib/models/providers.model";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

// Zod schema for validation
const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().refine((val) => parseInt(val, 10) >= 18, {
    message: "Age should be 18 or older",
  }),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number should be 10 digits"),
  email: z.string().email("Email should be valid"),
  address: z.string().min(5, "Address is too small"),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters long")
    .regex(/[A-Z]/, "Password should contain a capital letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password should contain a special character"
    ),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const emailParam = params.get("email");
    const nameParam = params.get("name");

    if (emailParam) form.setValue("email", emailParam);
    if (nameParam) form.setValue("name", nameParam);
  }, [searchParams, form.setValue]);

  const onSubmit = async (data: SignupFormValues) => {
    const newMember: IMemberBase = {
      ...data,
      age: Number(data.age),
      role: "admin",
    };
    const result = await registerMember(newMember);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <h2 className="text-xl font-bold">Sign Up</h2>
          <p className="text-sm">
            Create a new account to start borrowing books.
          </p>

          {Object.keys(signupSchema.shape).map((field) => (
            <FormItem key={field}>
              <FormControl>
                <Input
                  type={
                    field === "password"
                      ? "password"
                      : field === "age" || field === "phoneNumber"
                      ? "number"
                      : "text"
                  }
                  onKeyDown={(e) => {
                    if (
                      (field === "age" || field === "phoneNumber") &&
                      (e.key === "e" ||
                        e.key === "-" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowDown")
                    ) {
                      e.preventDefault();
                    }
                  }}
                  {...form.register(field as keyof SignupFormValues)}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              </FormControl>
              <div className="min-h-[1rem]">
                {form.formState.errors[field as keyof SignupFormValues] ? (
                  <FormMessage className="pl-3 text-red-500 text-xs">
                    {
                      form.formState.errors[field as keyof SignupFormValues]
                        ?.message
                    }
                  </FormMessage>
                ) : (
                  ""
                )}
              </div>
            </FormItem>
          ))}
          <Button type="submit">Sign up</Button>
          <hr />
        </form>
      </Form>
      {pathName === "/signup" ? (
        <span>
          Have an account?{" "}
          <Link href="/signin">
            <Button variant="link" className="px-0 font-bold">
              Sign in
            </Button>
          </Link>
        </span>
      ) : (
        ""
      )}
    </div>
  );
};
