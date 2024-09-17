"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function OnlyRequestSwitch() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const [isUnclaimed, setIsUnclaimed] = useState(false);

  useEffect(() => {
    const currentUnclaimed = searchParams.get("onlyRequests");
    setIsUnclaimed(currentUnclaimed === "true");
  }, [searchParams]);

  const handleSwitch = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("onlyRequests", "true");
      params.delete("filter");
    } else {
      params.delete("onlyRequests");
    }
    setIsUnclaimed(checked);
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="unclaimed-mode"
        checked={isUnclaimed}
        onCheckedChange={handleSwitch}
      />
      <Label htmlFor="unclaimed-mode" className="text-sm text-slate-500">
        Show only requests
      </Label>
    </div>
  );
}
