"use server";

import { createFormatter } from "next-intl";
import { getFormatter } from "next-intl/server";

const INDIAN_SUBCONTINENT_TIMEZONES = [
  "Asia/Kolkata", // India
  "Asia/Calcutta",
  "Asia/Karachi", // Pakistan
  "Asia/Dhaka", // Bangladesh
  "Asia/Kathmandu", // Nepal
  "Asia/Thimphu", // Bhutan
  "Asia/Colombo", // Sri Lanka
  "Indian/Maldives", // Maldives
];

// Fetch exchange rate from INR to USD
const fetchExchangeRate = async (): Promise<number | null> => {
  const API_URL = "https://api.exchangerate-api.com/v4/latest/INR"; // Replace with a reliable API
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      console.error("Failed to fetch exchange rate: ", response.statusText);
      return null;
    }

    const data = await response.json();
    const usdRate = data.rates?.USD;
    if (!usdRate) {
      console.error("USD rate not found in API response.");
      return null;
    }
    return usdRate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
};

// Check if the user's timezone is in the Indian subcontinent
const isIndianSubcontinent = (timeZone: string): boolean => {
  return INDIAN_SUBCONTINENT_TIMEZONES.includes(timeZone);
};

// Main function to derive price in either INR or USD
export const derivePrice = async (price: number, timeZone: string) => {
  const format = await getFormatter();
  try {
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`User's Time Zone: ${timeZone}`);

    // If user is in the Indian subcontinent, return the price in INR
    if (isIndianSubcontinent(timeZone)) {
      return format.number(price, { style: "currency", currency: "INR" });
    }

    // Otherwise, fetch the exchange rate and return price in USD
    const exchangeRate = await fetchExchangeRate();
    if (exchangeRate === null) {
      throw new Error(
        "Unable to retrieve exchange rate. Please try again later."
      );
    }

    // const convertedPrice = price * exchangeRate;
    const convertedPrice = format.number(price * exchangeRate, {
      style: "currency",
      currency: "USD",
    });
    return convertedPrice;
  } catch (error) {
    console.error("Error deriving price:", error);
    return "Error calculating price";
  }
};
