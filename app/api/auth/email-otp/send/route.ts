import { randomInt } from "crypto";
import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { adminDb } from "@/lib/firebase-admin";
import {
  challengeId,
  corsHeaders,
  hashOtp,
  isValidEmail,
  normalizeEmail,
  OTP_EXPIRY_MS,
  OTP_RESEND_MS,
} from "@/lib/email-otp";

export const runtime = "nodejs";

function response(
  data: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(
    data,
    {
      status,
      headers: corsHeaders,
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!isValidEmail(email)) {
      return response(
        {
          success: false,
          message:
            "Valid email address enter karein.",
        },
        400
      );
    }

    const challengeRef = adminDb
      .collection("emailOtpChallenges")
      .doc(challengeId(email));

    const existingSnapshot =
      await challengeRef.get();

    if (existingSnapshot.exists) {
      const existing =
        existingSnapshot.data();

      const lastSentAt =
        existing?.lastSentAt instanceof Timestamp
          ? existing.lastSentAt.toMillis()
          : 0;

      const waitMs =
        OTP_RESEND_MS -
        (Date.now() - lastSentAt);

      if (waitMs > 0) {
        return response(
          {
            success: false,
            message:
              `OTP dobara bhejne ke liye ${Math.ceil(
                waitMs / 1000
              )} seconds wait karein.`,
          },
          429
        );
      }
    }

    const otp = String(
      randomInt(100000, 1000000)
    );

    await challengeRef.set({
      email,
      otpHash: hashOtp(email, otp),
      attempts: 0,
      expiresAt: Timestamp.fromMillis(
        Date.now() + OTP_EXPIRY_MS
      ),
      lastSentAt: Timestamp.now(),
      createdAt: FieldValue.serverTimestamp(),
    });

    const apiKey =
      process.env.RESEND_API_KEY;

    const fromEmail =
      process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      throw new Error(
        "Resend email configuration is missing"
      );
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject:
        "Your PropertyHub login OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;color:#102A1A">
          <div style="font-size:22px;font-weight:800">
            Property<span style="color:#16A34A">Hub</span>
          </div>

          <h1 style="margin-top:30px;font-size:26px">
            Verify your email
          </h1>

          <p style="color:#64756A;line-height:1.7">
            Use this one-time password to securely login to PropertyHub.
          </p>

          <div style="margin:26px 0;padding:20px;border-radius:16px;background:#EAF7EE;text-align:center;font-size:34px;font-weight:900;letter-spacing:8px;color:#15803D">
            ${otp}
          </div>

          <p style="color:#64756A">
            This OTP expires in 10 minutes.
          </p>

          <p style="margin-top:28px;font-size:12px;color:#94A39A">
            If you did not request this OTP, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (result.error) {
      await challengeRef.delete();

      console.error(
        "Resend OTP error:",
        result.error
      );

      return response(
        {
          success: false,
          message:
            "OTP email send nahi ho paya. Please try again.",
        },
        502
      );
    }

    return response({
      success: true,
      message:
        "6-digit OTP aapke email par bhej diya gaya hai.",
    });
  } catch (error) {
    console.error(
      "Send email OTP failed:",
      error
    );

    return response(
      {
        success: false,
        message:
          "OTP send nahi ho paya. Please try again.",
      },
      500
    );
  }
}
