"use client";

import { derivePrice } from "@/lib/derivePrice";
import React, { useEffect, useState } from "react";
import PriceSkeleton from "./skeletons/PriceSkeleton";

type PriceTagProps = {
  price: number;
};

const PriceTag: React.FC<PriceTagProps> = React.memo(async ({ price }) => {
  const [formattedPrice, setFormattedPrice] = useState<
    string | React.ReactNode
  >(<PriceSkeleton />);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const result = await derivePrice(price, timeZone);
        setFormattedPrice(result);
      } catch (error) {
        console.error("Error fetching price:", error);
        setFormattedPrice("--");
      }
    };

    fetchPrice();
  }, [price]);

  return <span>{formattedPrice}</span>;
});

export default PriceTag;
