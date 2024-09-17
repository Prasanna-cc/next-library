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
import Link from "next/link";

export const ProfileSheet = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false); // Track whether editing mode is on
  const handleBack = () => setIsEditing(false);
  const [open, setOpen] = useState(false);

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
              <span className="hidden md:inline-block md:px-1">Profile</span>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-lg overflow-y-scroll"
        >
          <SheetHeader>
            <SheetTitle className="pb-8">Profile</SheetTitle>
          </SheetHeader>
          <div>
            {/* Profile Section */}
            {!isEditing ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {session?.user?.image ? (
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={session.user.image}
                        alt="Profile"
                        width={10}
                        height={10}
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

                {/* My Requests Section */}
                <div>
                  <div className="pb-3 flex justify-between items-center">
                    <h4 className="font-semibold">My Requests</h4>
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
                    <h4 className="font-semibold">Due list</h4>
                    <SheetClose asChild>
                      <Link href="/dashboard/transactions">
                        <Button variant="ghost">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Name</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Return Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Book 1</TableCell>
                        <TableCell>2024-08-27</TableCell>
                        <TableCell>2024-08-29</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Book 2</TableCell>
                        <TableCell>2024-08-28</TableCell>
                        <TableCell>2024-08-30</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <Tabs defaultValue="account-info">
                  <TabsList>
                    <TabsTrigger value="account-info">Account Info</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>

                  <TabsContent value="account-info">
                    <form className="space-y-4">
                      <Input
                        name="name"
                        placeholder="Name"
                        defaultValue={session?.user?.name || ""}
                      />
                      <Input
                        name="email"
                        placeholder="Email"
                        defaultValue={session?.user?.email || ""}
                      />
                      <Input name="age" placeholder="Age" />
                      <Input name="address" placeholder="Address" />
                      <Input name="phone" placeholder="Phone Number" />
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="password">
                    <form className="space-y-4">
                      <Input
                        name="current-password"
                        type="password"
                        placeholder="Current Password"
                      />
                      <Input
                        name="new-password"
                        type="password"
                        placeholder="New Password"
                      />
                      <Input
                        name="confirm-password"
                        type="password"
                        placeholder="Confirm Password"
                      />
                      <Button type="submit">Change Password</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
