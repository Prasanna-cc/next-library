"use client";
import React, { useEffect, useState } from "react";
import Buy from "./Buy";
import { useRouter } from "next/navigation";
import { IMember } from "@/lib/models/member.schema";
import { NextApiResponse } from "next";

const BuyCredits = ({
  user,
  onSuccess,
}: {
  user: IMember;
  onSuccess: (amount: number) => void;
}) => {
  const router = useRouter();
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setRazorpayReady(true);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    const loadScript = async () => {
      await loadRazorpayScript();
    };

    loadScript(); // Calling the async function inside useEffect.
  }, []);

  const makePayment = async () => {
    if (!razorpayReady) {
      console.error("Razorpay is not ready");
      return; // Ensure Razorpay is loaded before proceeding
    }

    const key = "rzp_test_V8RbPCpR6oZ2Db";

    try {
      // Make API call to the serverless API
      const response = await fetch("/api/razorpay");

      if (!response.ok) {
        console.error("Failed to fetch:", response.status, response.statusText);
        return; // Handle the error appropriately
      }

      const json = await response.json();

      const { order } = json;

      if (!order) {
        console.error("Order not found in the response");
        return; // Handle the error appropriately
      }

      const options = {
        key: key,
        name: "mmantratech",
        currency: order.currency,
        amount: order.amount,
        order_id: order.id,
        description: "Understanding RazorPay Integration",
        handler: async function (response: any) {
          const verificationResponse = await fetch("/api/verifyPayment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              // professorId: professorId,
              amount: order.amount,
            }),
          });

          const verificationResult = await verificationResponse.json();

          if (verificationResult?.message === "success") {
            const amountInRupees = Math.round(Number(order.amount) / 100);
            onSuccess(amountInRupees);
            window.location.reload();
          } else {
            console.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "Prasanna",
          email: "prasannanarayanap@gmail.com",
          contact: "9876543210",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed. Please try again. Contact support for help.");
        console.error("Payment failed:", response);
      });
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <>
      <Buy makePayment={makePayment} />
    </>
  );
};

export default BuyCredits;
