"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { getProviders, signIn, useSession } from "next-auth/react";
import { SignupForm } from "./SignupForm";
import { useEffect, useState } from "react";
import { Providers } from "../lib/models/providers.model";
import { redirect } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import React from "react";

// Zod schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Email should be valid"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({ isRedirect }: { isRedirect?: boolean }) => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<Providers>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res: Providers = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  const [isSignup, setIsSignup] = useState(false);
  const { replace } = useRouter();

  if (session) {
    redirect("/");
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleSignUp = () => {
    if (isRedirect) replace("/signup");
    setIsSignup(!isSignup);
  };

  const onSubmit = async (data: LoginFormValues) => {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!response?.ok)
      toast({
        variant: "destructive",
        title: "Email or password is incorrect",
        description: " Please verify and try again.",
      });
  };

  return (
    <>
      {isSignup ? (
        <div className="max-h-[472px] overflow-y-scroll flex flex-col justify-between">
          <SignupForm />
          <span>
            Have an account?{" "}
            <Button
              onClick={handleSignUp}
              variant="link"
              className="px-0 font-bold"
            >
              Sign in
            </Button>
          </span>
        </div>
      ) : (
        <div className="flex flex-col w-max max-w-96 md:max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-max justify-between gap-3"
            >
              <h2 className="text-xl font-bold">Sign In</h2>
              <p className="text-sm">
                Enter your credentials to log in to your account.
              </p>

              {Object.keys(loginSchema.shape).map((field) => (
                <FormItem key={field}>
                  <FormLabel>{field}</FormLabel>
                  <FormControl>
                    <Input
                      key={field}
                      type={field === "password" ? "password" : "text"}
                      {...form.register(field as keyof LoginFormValues)}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                    />
                  </FormControl>
                  <div className="min-h-[1rem]">
                    {form.formState.errors[field as keyof LoginFormValues] ? (
                      <FormMessage className="pl-3 text-red-500 text-xs">
                        {
                          form.formState.errors[field as keyof LoginFormValues]
                            ?.message
                        }
                      </FormMessage>
                    ) : (
                      ""
                    )}
                  </div>
                </FormItem>
              ))}

              <Button type="submit">Sign in</Button>
              <hr />
            </form>
          </Form>
          <div className="pt-3">
            {providers &&
              Object.values(providers)
                .filter((provider) => provider.id !== "credentials")
                .map((provider, index) => (
                  <button
                    key={index}
                    className="w-full p-2 bg-slate-600 text-white border rounded"
                    onClick={() => signIn(provider.id)}
                  >
                    Continue with {provider.name}
                  </button>
                ))}
          </div>
          <span>
            Do not have an account?{" "}
            <Button
              onClick={handleSignUp}
              variant="link"
              className="px-0 font-bold"
            >
              Sign up
            </Button>
          </span>
        </div>
      )}
    </>
  );
};

export const LoginDialog = ({ openOnLoad }: { openOnLoad?: boolean }) => {
  const [isOpen, setIsOpen] = useState(openOnLoad ?? false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {openOnLoad ? (
        ""
      ) : (
        <DialogTrigger asChild>
          <Button className="rounded-full" onClick={() => setIsOpen(true)}>
            Sign in
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="flex flex-col w-max items-center bg-white p-6 rounded-lg shadow-lg">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
};
