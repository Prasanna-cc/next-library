// "use client";

import { DashboardNavMenu } from "./DashboardNavMenu";
import HomeLink from "./HomeLink";
import { LoginDialog } from "./LoginForm";
import { ProfileSheet } from "./ProfileSheet";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export const Navbar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-h-14 px-4 items-center justify-between ">
        <div className=" flex justify-start gap-2">
          <HomeLink />
        </div>
        <div className=" flex items-center gap-2 justify-end">
          {/* <div className="w-full flex-1 md:w-auto md:flex-none">
            <ModalPopup
              triggerComp={
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm font-normal md:w-[260px]"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search books...
                </Button>
              }
              popupContent={
                <>
                  <h1>Search Books</h1>
                  <p>
                    Enter the title, author, or ISBN of the book you're looking
                    for.
                  </p>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="search"
                        placeholder="Search..."
                        className="col-span-4"
                      />
                    </div>
                  </div>
                </>
              }
            ></ModalPopup>
          </div> */}
          {children}
          {/* <div className=" hidden md:inline-flex md:gap-2">
                <CategoriesMenu />
              </div>
          {session ? (
            <>
              <MyTransactionsMenu />
              <ProfileSheet session={session} />
            </>
          ) : (
            <>
              <ModalPopup
                triggerComp={
                  <Button variant="default" className="rounded-full">
                    Sign in
                  </Button>
                }
                popupContent={<LoginForm session={session}></LoginForm>}
              ></ModalPopup>
            </>
          )} */}
        </div>
      </div>
    </header>
  );
};
