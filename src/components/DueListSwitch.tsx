"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function ShowDueListSwitch() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const [isUnclaimed, setIsUnclaimed] = useState(false);
  const t = useTranslations("TransactionsPage");

  useEffect(() => {
    const currentUnclaimed = searchParams.get("showDueList");
    setIsUnclaimed(currentUnclaimed === "true");
  }, [searchParams]);

  const handleSwitch = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("showDueList", "true");
      params.delete("page");
      params.delete("filter");
      params.delete("onlyRequests");
    } else {
      params.delete("showDueList");
    }
    setIsUnclaimed(checked);
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="due-unclaimed-mode"
        checked={isUnclaimed}
        onCheckedChange={handleSwitch}
      />
      <Label htmlFor="due-unclaimed-mode" className="text-sm text-slate-500">
        Show Due List
      </Label>
    </div>
  );
}
