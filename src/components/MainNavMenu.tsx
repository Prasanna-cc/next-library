"use client";

import { IMember } from "@/lib/models/member.model";
import { DashboardNavMenu } from "./DashboardNavMenu";
import { LoginDialog } from "./LoginForm";
import { ProfileSheet } from "./ProfileSheet";
import { useSession } from "next-auth/react";

interface NavMenuProps {
  userDetails: IMember | undefined | null;
}

export const MainNavMenu = ({ userDetails }: NavMenuProps) => {
  const { data: session } = useSession();

  return session ? (
    <>
      <DashboardNavMenu />
      <ProfileSheet userDetails={userDetails} />
    </>
  ) : (
    <LoginDialog />
  );
};
