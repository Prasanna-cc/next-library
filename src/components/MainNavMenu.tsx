"use client";

import { DashboardNavMenu } from "./DashboardNavMenu";
import { LoginDialog } from "./LoginForm";
import { ProfileSheet } from "./ProfileSheet";
import { useSession } from "next-auth/react";

export const MainNavMenu = () => {
  const { data: session } = useSession();

  return session ? (
    <>
      <DashboardNavMenu />
      <ProfileSheet />
    </>
  ) : (
    <LoginDialog />
  );
};
