"use client";

import * as React from "react";
// import Link from "next/link";
import { useSession } from "next-auth/react";
import { MenuSquareIcon, Users2 } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link, routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function DashboardNavMenu() {
  const { data: session } = useSession();
  const t = useTranslations("MainNavMenu");

  return (
    <div className="flex gap-1">
      <Link href={"/dashboard/professors"}>
        <Button variant={"outline"} className="rounded-full px-2">
          <span className="flex gap-1 items-center">
            <Users2 className="md:h-4 w-fit md:w-4" />{" "}
            <span className="hidden md:inline-flex">Professors</span>
          </span>
        </Button>
      </Link>
      {session?.user.role === "admin" ? (
        <Menubar className="border-none relative z-10 flex w-screen max-w-max items-center justify-center">
          <MenubarMenu>
            <MenubarTrigger>
              <div className="flex items-center gap-1">
                <MenuSquareIcon className="md:h-4 md:w-4" />
                <span className="hidden md:inline-flex">{t("menu")}</span>
              </div>
            </MenubarTrigger>
            <MenubarContent>
              <ul className="grid w-max gap-3 p-6">
                <>
                  <ListItem
                    title={t("allTransactions")}
                    href="/dashboard/admin/allTransactions"
                  />
                  {/* <ListItem
                    title={t("userTransactions")}
                    href="/dashboard/transactions"
                  /> */}
                  <ListItem title={t("books")} href="/dashboard/admin/books" />
                  <ListItem
                    title={t("members")}
                    href="/dashboard/admin/members"
                  />
                </>
              </ul>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        // <Link title="My Transactions" href="/dashboard/transactions">
        //   <Button variant="ghost">{t("userTransactions")}</Button>
        // </Link>
        ""
      )}
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <MenubarItem asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </MenubarItem>
    </li>
  );
});
ListItem.displayName = "ListItem";
