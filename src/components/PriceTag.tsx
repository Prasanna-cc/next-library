"use client";

import { derivePrice } from "@/lib/derivePrice";
import React, { useEffect, useState } from "react";
import PriceSkeleton from "./skeletons/PriceSkeleton";

type PriceTagProps = {
  price: number;
};

const PriceTagComponent: React.FC<PriceTagProps> = ({ price }) => {
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
};

const PriceTag: React.FC<PriceTagProps> = React.memo(PriceTagComponent);

export default PriceTag;
