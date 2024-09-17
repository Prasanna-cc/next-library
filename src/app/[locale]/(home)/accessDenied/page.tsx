"use client";

import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">
        <span className="flex items-center gap-1">
          <CircleX className="h-8 w-8" />
          Access Denied
        </span>
      </h1>
      <p className=" text-gray-700">
        You do not have permission to view this page.
      </p>
      <Link href="/">
        <Button variant="default">Go to Home</Button>
      </Link>
    </div>
  );
}
