import { createHash, randomInt } from "crypto";
import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { adminDb } from "@/lib/firebase-admin";
import {
  challengeId,
  hashOtp,
  isValidEmail,
  normalizeEmail,
  OTP_EXPIRY_MS,
  OTP_RESEND_MS,
} from "@/lib/email-otp";

export const runtime = "nodejs";

const OTP_IP_WINDOW_MS = 10 * 60 * 1000;
const OTP_IP_MAX_SENDS = 20;

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashClientIp(ip: string) {
  return createHash("sha256")
    .update(ip)
    .digest("hex");
}

async function consumeOtpSendQuota(
  request: Request
) {
  const ip = getClientIp(request);
  const ipHash = hashClientIp(ip);

  const ref = adminDb
    .collection("emailOtpIpRateLimits")
    .doc(ipHash);

  return adminDb.runTransaction(
    async (transaction) => {
      const snapshot = await transaction.get(ref);

      const now = Date.now();

      if (!snapshot.exists) {
        transaction.set(ref, {
          count: 1,
          windowStartedAt:
            Timestamp.fromMillis(now),
          updatedAt:
            FieldValue.serverTimestamp(),
        });

        return true;
      }

      const data = snapshot.data() || {};

      const windowStartedAt =
        data.windowStartedAt instanceof Timestamp
          ? data.windowStartedAt.toMillis()
          : 0;

      const count = Number(data.count || 0);

      if (
        !windowStartedAt ||
        now - windowStartedAt >= OTP_IP_WINDOW_MS
      ) {
        transaction.set(
          ref,
          {
            count: 1,
            windowStartedAt:
              Timestamp.fromMillis(now),
            updatedAt:
              FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        return true;
      }

      if (count >= OTP_IP_MAX_SENDS) {
        return false;
      }

      transaction.update(ref, {
        count: FieldValue.increment(1),
        updatedAt:
          FieldValue.serverTimestamp(),
      });

      return true;
    }
  );
}

function response(
  data: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(
    data,
    {
      status,
    }
  );
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

    const withinIpQuota =
      await consumeOtpSendQuota(request);

    if (!withinIpQuota) {
      return response(
        {
          success: false,
          message:
            "Bahut zyada OTP requests hui hain. 10 minutes baad try karein.",
        },
        429
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
