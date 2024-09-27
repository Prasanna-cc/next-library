"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
  MenuIcon,
  Users2,
  BookOpen,
  UserPlus,
  FileText,
  UserCog2,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { IMember } from "@/lib/models/member.model";
import { ProfileSheet } from "./ProfileSheet";
import { LoginDialog } from "./LoginForm";
import { LocaleSelector } from "./LocaleSelecter";
import { motion, AnimatePresence } from "framer-motion";

interface NavProps {
  userDetails: IMember | undefined | null;
}

export function DashboardNavMenu({ userDetails }: NavProps) {
  const { data: session } = useSession();
  const t = useTranslations("MainNavMenu");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const MenuItem = ({
    href,
    icon: Icon,
    title,
  }: {
    href: string;
    icon: React.ElementType;
    title: string;
  }) => (
    <Link
      href={href}
      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  );

  return (
    <nav className="relative z-10">
      <div className="flex items-center justify-between w-full gap-2">
        <div>
          <Button
            variant="ghost"
            className="p-2"
            onMouseEnter={() => setIsMenuOpen(true)}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
        <div>
          {session ? (
            <ProfileSheet userDetails={userDetails} />
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-[52px] z-50 overflow-hidden "
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            {/* Transparent backdrop */}
            <div className="w-full bg-slate-100/95  border-b-slate-400 backdrop-blur-md flex justify-around gap-6 py-6 px-4 md:px-8 lg:px-16">
              {/* Locale Selector - placed separately with its own container */}

              {/* Main Menu Content */}
              <div>
                <h3 className="font-semibold mb-2">{t("find")}</h3>
                <MenuItem
                  href="/dashboard/professors"
                  icon={Users2}
                  title={t("professors")}
                />
              </div>

              {session?.user.role === "admin" && (
                <div>
                  <h3 className="font-semibold mb-2">{t("manage")}</h3>
                  <div className="flex flex-col justify-between md:flex-row md:gap-6">
                    <div className="flex flex-col">
                      <MenuItem
                        href="/dashboard/admin/allTransactions"
                        icon={FileText}
                        title={t("allTransactions")}
                      />
                      <MenuItem
                        href="/dashboard/admin/books"
                        icon={BookOpen}
                        title={t("books")}
                      />
                    </div>
                    <div className="flex flex-col">
                      <MenuItem
                        href="/dashboard/admin/members"
                        icon={UserCog}
                        title={t("members")}
                      />
                      <MenuItem
                        href="/dashboard/admin/professors"
                        icon={UserCog2}
                        title={t("professors")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {session && session.user.role !== "admin" && (
                <div>
                  <h3 className="font-semibold mb-2">{t("manage")}</h3>
                  <MenuItem
                    href="/dashboard/transactions"
                    icon={FileText}
                    title={t("myTransactions")}
                  />
                </div>
              )}
              <div
                className="relative z-10 w-fit"
                onClick={(e: React.MouseEvent) => {
                  // e.preventDefault();
                  setIsMenuOpen(true);
                }}
              >
                {/* <LocaleSelector
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setIsMenuOpen(true);
                  }}
                /> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
