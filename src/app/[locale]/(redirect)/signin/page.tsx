"use client";

import { LoginForm } from "@/components/LoginForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Signin = () => {
  const { data: session } = useSession();

  useEffect(() => {
    // toast({
    //   variant: "destructive",
    //   title: "Looks like you have not logged in",
    //   description: "Please login to continue.",
    // });

    if (session) {
      redirect("/");
    }
  }, [session]);
  return (
    <>
      <LoginForm isRedirect={true} />
    </>
  );
};

export default Signin;
