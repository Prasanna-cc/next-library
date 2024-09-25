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
import {
  User,
  Edit,
  ArrowRight,
  CircleUser,
  BookOpen,
  Clock,
  LogOut,
  ShieldAlert,
  Users,
  ArrowLeft,
  CalendarRange,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { signOut, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Link, redirect } from "@/i18n/routing";
import MemberEditForm from "./librarySpecificComponents/adminComponents/MemberEditForm";
import { IMember } from "@/lib/models/member.model";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface ProfileSheetProps {
  userDetails: IMember | undefined | null;
}

export const ProfileSheet = ({ userDetails }: ProfileSheetProps) => {
  const { data: session } = useSession();
  if (!session || session === null) redirect(`/signin`);
  const [isEditing, setIsEditing] = useState(false);
  const handleBack = () => setIsEditing(false);
  const t = useTranslations("Profile");

  const ActivityCard = ({
    title,
    icon,
    link,
  }: {
    title: string;
    icon: React.ReactNode;
    link: string;
  }) => (
    <SheetClose asChild>
      <Link href={link} className="block">
        <Card className="hover:bg-accent transition-colors">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {icon}
              <span className="font-medium">{title}</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </CardContent>
        </Card>
      </Link>
    </SheetClose>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
          <Avatar>
            {session?.user?.image ? (
              <Image
                width={100}
                height={100}
                src={session.user.image}
                alt="Profile"
              />
            ) : (
              <AvatarFallback>
                {session?.user.name ? (
                  session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                ) : (
                  <CircleUser className="h-6 w-6" />
                )}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">{t("account")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {!isEditing ? (
            <>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      {session?.user?.image ? (
                        <Image
                          width={1000}
                          height={1000}
                          src={session.user.image}
                          alt="Profile"
                        />
                      ) : (
                        <AvatarFallback>
                          {session?.user.name ? (
                            session.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          ) : (
                            <CircleUser className="h-10 w-10" />
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-xl font-semibold">
                          {session?.user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                      <Badge
                        variant={"default"}
                        className="w-fit text-xs capitalize"
                      >
                        {session?.user?.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> {t("editProfile")}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("yourActivity")}</h3>
                <ActivityCard
                  title={t("requests")}
                  icon={<BookOpen className="h-5 w-5" />}
                  link="/dashboard/transactions?onlyRequests=true"
                />
                <ActivityCard
                  title={t("due")}
                  icon={<Clock className="h-5 w-5" />}
                  link="/dashboard/transactions?showDueList=true"
                />
                <ActivityCard
                  title={t("schedules")}
                  icon={<CalendarRange className="h-5 w-5" />}
                  link="/dashboard/schedules"
                />
              </div>

              {session?.user.role === "admin" && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {t("adminActivity")}
                  </h3>
                  <ActivityCard
                    title={t("allRequests")}
                    icon={<ShieldAlert className="h-5 w-5" />}
                    link="/dashboard/admin/allTransactions?filter=requested"
                  />
                  <ActivityCard
                    title={t("allDues")}
                    icon={<Users className="h-5 w-5" />}
                    link="/dashboard/admin/allTransactions?showDueList=true"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await signOut();
                    toast({
                      variant: "default",
                      title: "Logged out successfully",
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="pb-3 flex justify-between items-center">
                <h4 className="font-semibold">{t("editProfile")}</h4>
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
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
  );
};
