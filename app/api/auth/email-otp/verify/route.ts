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
  corsHeaders,
  hashOtp,
  isValidEmail,
  normalizeEmail,
  otpMatches,
  OTP_MAX_ATTEMPTS,
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

    const challengeRef = adminDb
      .collection("emailOtpChallenges")
      .doc(challengeId(email));

    const challengeSnapshot =
      await challengeRef.get();

    if (!challengeSnapshot.exists) {
      return response(
        {
          success: false,
          message:
            "OTP request nahi mila. Naya OTP bhejein.",
        },
        400
      );
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
      await challengeRef.delete();

      return response(
        {
          success: false,
          message:
            "OTP expire ho gaya hai. Naya OTP bhejein.",
        },
        400
      );
    }

    const attempts =
      Number(challenge.attempts || 0);

    if (attempts >= OTP_MAX_ATTEMPTS) {
      await challengeRef.delete();

      return response(
        {
          success: false,
          message:
            "Bahut zyada wrong attempts. Naya OTP bhejein.",
        },
        429
      );
    }

    const valid = otpMatches(
      String(challenge.otpHash || ""),
      hashOtp(email, otp)
    );

    if (!valid) {
      await challengeRef.update({
        attempts:
          FieldValue.increment(1),
      });

      return response(
        {
          success: false,
          message:
            `OTP incorrect hai. ${
              OTP_MAX_ATTEMPTS -
              attempts -
              1
            } attempts remaining.`,
        },
        400
      );
    }

    await challengeRef.delete();

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
