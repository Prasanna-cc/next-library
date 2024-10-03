"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Awaitable } from "next-auth";

const Buy = ({
  makePayment,
}: {
  makePayment: ({ productId }: { productId: string }) => Awaitable<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={async () => {
        setIsLoading(true);
        await makePayment({ productId: "example_ebook" });
        setIsLoading(false);
      }}
      disabled={isLoading}
      className="rounded-e-full py-2 h-fit w-8 hover:bg-black hover:text-white"
    >
      <PlusIcon className="h-4 w-4" />
    </Button>
  );
};

export default Buy;
