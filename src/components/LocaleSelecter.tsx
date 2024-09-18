"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

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
      <Select
        defaultValue={localActive}
        onValueChange={handleSelection}
        disabled={isPending}
      >
        <SelectTrigger className="w-full min-w-[110px] rounded-full bg-slate-100 text-slate-500 font-medium">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
