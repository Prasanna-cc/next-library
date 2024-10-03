"use client";

import { InlineWidget } from "react-calendly";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default function SessionPage({
  searchParams,
}: {
  searchParams?: {
    eventLink?: string;
  };
}) {
  const { data: session } = useSession();
  const t = useTranslations("ProfessorsPage");

  return (
    <div className="w-full px-4 py-8 flex flex-col justify-between gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Book Your Session</h1>
        {/* <span className="text-slate-500 text-sm">{t("description")}</span> */}
      </div>
      <Link href={"/dashboard/professors"}>
        <Button>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </Link>
      <div className="flex flex-col gap-3 justify-between">
        <div className="w-full h-full">
          {searchParams && searchParams.eventLink ? (
            <InlineWidget
              url={searchParams.eventLink}
              prefill={{
                name: session?.user.name || "",
                email: session?.user.email || "",
              }}
              pageSettings={{
                backgroundColor: "ffffff",
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: "000000",
                textColor: "64748b",
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
              <span className="h-full text-sm text-slate-500">
                Looks like there was a problem {":("}...
              </span>
              <Link href={"/dashboard/professors"}>
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
