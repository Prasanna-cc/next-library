"use client";

import { IMember } from "@/lib/models/member.model";
import { DashboardNavMenu } from "./DashboardNavMenu";
import { LoginDialog } from "./LoginForm";
import { ProfileSheet } from "./ProfileSheet";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import { Skeleton } from "./ui/skeleton";
import { memo } from "react";

interface NavMenuProps {
  userDetails: IMember | undefined | null;
}

const NavMenuComponent = ({ userDetails }: NavMenuProps) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        {/* <Skeleton className="w-28 h-10 rounded-full" /> */}
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    );
  }

  return <DashboardNavMenu userDetails={userDetails} />;
};

export const MainNavMenu = memo(NavMenuComponent);
