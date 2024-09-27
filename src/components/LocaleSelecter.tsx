"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Languages } from "lucide-react";

interface LocaleSwitcherProps extends React.ComponentPropsWithoutRef<"div"> {}

export const LocaleSelector = ({ ...delegated }: LocaleSwitcherProps) => {
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const pathName = usePathname();
  const localActive = useLocale();

  const languageOptions = [
    { value: "kn", label: "ಕನ್ನಡ" },
    { value: "en", label: "English" },
  ];

  const handleSelection = (selection: string) => {
    startTransition(() => {
      if (pathName.startsWith(`/${localActive}`)) {
        replace(pathName.replace(`/${localActive}`, `/${selection}`));
      } else {
        replace(`/${selection}${pathName}`);
      }
    });
  };

  return (
    <div className="w-full flex items-center" {...delegated}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full px-2 rounded-full  text-slate-500 font-medium"
            disabled={isPending}
          >
            <span className="flex gap-1 items-center">
              <Languages className="md:h-4 w-fit md:w-4" />
              <span className="hidden md:inline-flex">Language</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[160px]">
          {languageOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSelection(option.value)}
              className="flex items-center gap-2"
            >
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
