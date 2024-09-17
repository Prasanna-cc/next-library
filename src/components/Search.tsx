"use client";
import { Search } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import React from "react";

interface SearchProps extends React.ComponentPropsWithoutRef<"input"> {}

export default function SearchComponent({ ...delegated }: SearchProps) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
      params.set("page", "1");
    } else {
      params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  }, 1000);
  return (
    <div className=" border focus-within:outline focus-within:outline-offset-2 focus-within:outline-slate-400 rounded-full flex items-center justify-stretch">
      <div className="px-2">
        <label htmlFor="search">
          <Search className="h-4 w-4" />
        </label>
      </div>
      <input
        {...delegated}
        className={
          " w-full min-h-10 px-1 border-none rounded-full outline-none"
        }
        id="search"
        type={"search"}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
