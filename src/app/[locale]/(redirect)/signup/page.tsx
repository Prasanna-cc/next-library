"use client";

import { SignupForm } from "../../../../components/SignupForm";
import { redirect } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const Signup = () => {
  const { data: session } = useSession();

  useEffect(() => {
    // toast({
    //   variant: "destructive",
    //   title: "Looks like you do not have an account,",
    //   description: "Please signup to continue.",
    // });

    if (session) {
      redirect("/");
    }
  }, [session]);
  return (
    <>
      <SignupForm></SignupForm>
    </>
  );
};

export default Signup;
