import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { AppEnvs } from "@/lib/core/read-env";
import { findMember, updateMember } from "@/lib/actions";
// import Payment from "../../../database/model/Payment";
// import dbConnect from '../../../database/database';

// Make sure to load environment variables properly
const instance = new Razorpay({
  key_id: "rzp_test_V8RbPCpR6oZ2Db", // fallback in case env var is not set
  key_secret: "wHt8UgTsSVsG5PnVDz7J5yo5", // fallback in case env var is not set
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Parse the request JSON
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      //   professorId,
      userId,
    } = await req.json();

    // Log the received IDs
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Ensure environment variables are loaded
    const secret = "wHt8UgTsSVsG5PnVDz7J5yo5";
    if (!secret) {
      console.error("RAZORPAY_APT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate HMAC signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    // If the signature is valid, proceed with saving the payment info
    if (isAuthentic) {
      const member = await findMember(userId);
      const previousCredits = member?.wallet;
      if (!previousCredits) {
        console.error("member fetch failed");
        return NextResponse.json({ message: "fail" }, { status: 500 });
      }
      const amountInRupees = Math.round(amount / 100);
      const updated = await updateMember(userId, {
        wallet: previousCredits + amountInRupees,
      });

      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      console.error("Payment verification failed");
      return NextResponse.json({ message: "fail" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during payment verification:", error);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
  }
}
