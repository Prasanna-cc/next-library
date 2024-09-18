"use client";

import { Link } from "@/i18n/routing";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

const HomeLink = () => {
  const t = useTranslations("LibraryName");

  return (
    <Link className="flex items-center justify-between gap-2" href="/">
      <BookOpen className="h-6 w-6" />
      <span className="font-bold inline-block">{t("title")}</span>
    </Link>
  );
};

export default HomeLink;
