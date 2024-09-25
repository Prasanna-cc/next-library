import HomeLink from "./HomeLink";

export const Navbar = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-h-14 px-4 items-center justify-between ">
        <div className=" flex justify-start gap-2">
          <HomeLink />
        </div>
        <div className=" flex items-center gap-2 justify-end">{children}</div>
      </div>
    </header>
  );
};
