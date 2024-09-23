"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { User, Edit, ArrowLeft, ArrowRight, CircleUser } from "lucide-react"; // For user and edit icons
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Link, redirect } from "@/i18n/routing";
import MemberEditForm from "./librarySpecificComponents/adminComponents/MemberEditForm";
import { UserEdit } from "./librarySpecificComponents/UserDetails";
import { IMember } from "@/lib/models/member.model";

interface ProfileSheetProps {
  userDetails: IMember | undefined | null;
}

export const ProfileSheet = ({ userDetails }: ProfileSheetProps) => {
  const { data: session } = useSession();
  if (!session || session === null) redirect(`/signin`);
  const [isEditing, setIsEditing] = useState(false);
  const handleBack = () => setIsEditing(false);
  const t = useTranslations("Profile");

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full p-1 rounded-full" asChild>
            <div className="w-full h-fit flex items-center justify-center">
              {session?.user?.image ? (
                <Image
                  className="min-w-9 min-h-9 rounded-full "
                  src={session.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                />
              ) : (
                <CircleUser />
              )}
              <span className="hidden md:inline-block md:px-1">
                {t("title")}
              </span>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-lg overflow-y-scroll"
        >
          <SheetHeader>
            <SheetTitle className="pb-8">{t("title")}</SheetTitle>
          </SheetHeader>
          <div>
            {/* Profile Section */}
            {!isEditing ? (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-4">
                    {session?.user?.image ? (
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={session.user.image}
                        alt="Profile"
                        width={36}
                        height={36}
                      />
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                    <div>
                      <p className="font-semibold">{session?.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <hr className="my-4" />

                {session?.user.role === "admin" ? (
                  <div>
                    <div>
                      <div className="pb-3 flex justify-between items-center">
                        <h4 className="font-semibold">{"All Requests"}</h4>
                        <SheetClose asChild>
                          <Link href="/dashboard/admin/allTransactions?filter=requested">
                            <Button variant="ghost">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <hr className="my-4" />
                    <div>
                      <div className="pb-3 flex justify-between items-center">
                        <h4 className="font-semibold">{"All Dues"}</h4>
                        <SheetClose asChild>
                          <Link href="/dashboard/admin/allTransactions?showDueList=true">
                            <Button variant="ghost">
                              <ArrowRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <hr className="my-4" />
                  </div>
                ) : (
                  ""
                )}

                {/* My Requests Section */}
                <div>
                  <div className="pb-3 flex justify-between items-center">
                    <h4 className="font-semibold">{t("requests")}</h4>
                    <SheetClose asChild>
                      <Link href="/dashboard/transactions?onlyRequests=true">
                        <Button variant="ghost">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                  {/*<Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
                    <TransactionsTable fetchType="requests" limit={5} />
                  </Suspense> */}
                </div>

                <hr className="my-4" />

                {/* My Transactions Section */}
                <div>
                  <div className="pb-3 flex justify-between items-center">
                    <h4 className="font-semibold">{t("due")}</h4>
                    <SheetClose asChild>
                      <Link href="/dashboard/transactions?showDueList=true">
                        <Button variant="ghost">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                <hr className="my-4" />

                <Button
                  variant="default"
                  onClick={async () => {
                    await signOut();
                    toast({
                      variant: "default",
                      title: "Logged out successfully",
                    });
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <div className="pb-3 flex justify-between items-center">
                  <h4 className="font-semibold">Edit Profile</h4>
                  {/* <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button> */}
                </div>
                <MemberEditForm
                  member={userDetails}
                  handleBack={handleBack}
                  forProfile
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
