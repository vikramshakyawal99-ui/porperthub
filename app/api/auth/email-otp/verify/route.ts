import { createHash } from "crypto";
import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";
import {
  challengeId,
  hashOtp,
  isValidEmail,
  normalizeEmail,
  otpMatches,
  OTP_MAX_ATTEMPTS,
} from "@/lib/email-otp";

export const runtime = "nodejs";

const OTP_VERIFY_IP_WINDOW_MS = 10 * 60 * 1000;
const OTP_VERIFY_IP_MAX_ATTEMPTS = 50;

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

async function consumeOtpVerifyQuota(
  request: Request
) {
  const ipHash = hashClientIp(
    getClientIp(request)
  );

  const ref = adminDb
    .collection("emailOtpVerifyIpRateLimits")
    .doc(ipHash);

  return adminDb.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(ref);

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
        now - windowStartedAt >=
          OTP_VERIFY_IP_WINDOW_MS
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

      if (
        count >= OTP_VERIFY_IP_MAX_ATTEMPTS
      ) {
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
    const otp = String(body.otp || "")
      .replace(/\D/g, "");

    if (
      !isValidEmail(email) ||
      otp.length !== 6
    ) {
      return response(
        {
          success: false,
          message:
            "Valid email aur 6-digit OTP enter karein.",
        },
        400
      );
    }

    const withinIpQuota =
      await consumeOtpVerifyQuota(request);

    if (!withinIpQuota) {
      return response(
        {
          success: false,
          message:
            "Bahut zyada OTP verification attempts hui hain. 10 minutes baad try karein.",
        },
        429
      );
    }

    const challengeRef = adminDb
      .collection("emailOtpChallenges")
      .doc(challengeId(email));

    const submittedOtpHash =
      hashOtp(email, otp);

    const verification =
      await adminDb.runTransaction(
        async (transaction) => {
          const challengeSnapshot =
            await transaction.get(
              challengeRef
            );

          if (!challengeSnapshot.exists) {
            return {
              status: "missing",
            } as const;
          }

          const challenge =
            challengeSnapshot.data() || {};

          const expiresAt =
            challenge.expiresAt instanceof Timestamp
              ? challenge.expiresAt.toMillis()
              : 0;

          if (
            !expiresAt ||
            Date.now() > expiresAt
          ) {
            transaction.delete(
              challengeRef
            );

            return {
              status: "expired",
            } as const;
          }

          const attempts =
            Number(
              challenge.attempts || 0
            );

          if (
            attempts >=
            OTP_MAX_ATTEMPTS
          ) {
            transaction.delete(
              challengeRef
            );

            return {
              status: "locked",
            } as const;
          }

          const valid = otpMatches(
            String(
              challenge.otpHash || ""
            ),
            submittedOtpHash
          );

          if (!valid) {
            const nextAttempts =
              attempts + 1;

            if (
              nextAttempts >=
              OTP_MAX_ATTEMPTS
            ) {
              transaction.delete(
                challengeRef
              );
            } else {
              transaction.update(
                challengeRef,
                {
                  attempts:
                    nextAttempts,
                }
              );
            }

            return {
              status: "invalid",
              remaining: Math.max(
                0,
                OTP_MAX_ATTEMPTS -
                  nextAttempts
              ),
            } as const;
          }

          transaction.delete(
            challengeRef
          );

          return {
            status: "valid",
          } as const;
        }
      );

    if (
      verification.status ===
      "missing"
    ) {
      return response(
        {
          success: false,
          message:
            "OTP request nahi mila. Naya OTP bhejein.",
        },
        400
      );
    }

    if (
      verification.status ===
      "expired"
    ) {
      return response(
        {
          success: false,
          message:
            "OTP expire ho gaya hai. Naya OTP bhejein.",
        },
        400
      );
    }

    if (
      verification.status ===
      "locked"
    ) {
      return response(
        {
          success: false,
          message:
            "Bahut zyada wrong attempts. Naya OTP bhejein.",
        },
        429
      );
    }

    if (
      verification.status ===
      "invalid"
    ) {
      return response(
        {
          success: false,
          message:
            `OTP incorrect hai. ${verification.remaining} attempts remaining.`,
        },
        400
      );
    }

    let user;

    try {
      user =
        await adminAuth.getUserByEmail(
          email
        );

      if (!user.emailVerified) {
        user = await adminAuth.updateUser(
          user.uid,
          {
            emailVerified: true,
          }
        );
      }
    } catch (error: any) {
      if (
        error?.code !==
        "auth/user-not-found"
      ) {
        throw error;
      }

      user = await adminAuth.createUser({
        email,
        emailVerified: true,
      });
    }

    const profileRef = adminDb
      .collection("users")
      .doc(user.uid);

    const profileSnapshot =
      await profileRef.get();

    const existingProfile =
      profileSnapshot.exists
        ? profileSnapshot.data() || {}
        : {};

    const existingRole = String(
      existingProfile.role || ""
    );

    if (
      existingRole === "admin" ||
      user.customClaims?.role === "admin"
    ) {
      return response(
        {
          success: false,
          message:
            "Admin login secure Admin page se karein.",
        },
        403
      );
    }

    if (existingRole === "property_dealer") {
      return response(
        {
          success: false,
          message:
            "Dealer/Builder account ke liye Business Login use karein.",
        },
        403
      );
    }

    if (!profileSnapshot.exists) {
      await profileRef.set({
        uid: user.uid,
        email,
        role: "buyer",
        accountType: "customer",
        canBuy: true,
        canListProperty: true,
        status: "active",
        createdAt:
          FieldValue.serverTimestamp(),
        updatedAt:
          FieldValue.serverTimestamp(),
      });
    } else {
      const profile =
        profileSnapshot.data() || {};

      const updates:
        Record<string, unknown> = {
          email,
          updatedAt:
            FieldValue.serverTimestamp(),
      };

      if (!profile.role) {
        updates.role = "buyer";
      }

      if (!profile.accountType) {
        updates.accountType =
          profile.role ===
          "property_dealer"
            ? "business"
            : "customer";
      }

      await profileRef.set(
        updates,
        { merge: true }
      );
    }

    const customToken =
      await adminAuth.createCustomToken(
        user.uid
      );

    return response({
      success: true,
      customToken,
      user: {
        uid: user.uid,
        email,
      },
    });
  } catch (error) {
    console.error(
      "Verify email OTP failed:",
      error
    );

    return response(
      {
        success: false,
        message:
          "OTP verify nahi ho paya. Please try again.",
      },
      500
    );
  }
}
