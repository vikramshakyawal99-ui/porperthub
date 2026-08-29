import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_REQUEST_SIZE = 12 * 1024 * 1024;
const MAX_UPLOADS_PER_MINUTE = 20;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_ROLES = new Set([
  "admin",
  "property_owner",
  "hostel_owner",
  "pg_owner",
  "room_owner",
  "resale_seller",
  "property_dealer",
  "team_member",
]);

function hasValidImageSignature(
  buffer: Buffer,
  mimeType: string
) {
  if (mimeType === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  if (mimeType === "image/avif") {
    if (buffer.length < 12) {
      return false;
    }

    const boxType =
      buffer.toString("ascii", 4, 8);

    if (boxType !== "ftyp") {
      return false;
    }

    const brand =
      buffer.toString(
        "ascii",
        8,
        Math.min(buffer.length, 32)
      );

    return (
      brand.includes("avif") ||
      brand.includes("avis")
    );
  }

  return false;
}

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

function json(
  body: Record<string, unknown>,
  status: number
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function authorizeUpload(
  request: Request
) {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authorization
    .slice("Bearer ".length)
    .trim();

  if (!idToken) {
    return null;
  }

  const decoded =
    await adminAuth.verifyIdToken(
      idToken,
      true
    );

  let role =
    typeof decoded.role === "string"
      ? decoded.role
      : "";

  if (!role) {
    const profileSnapshot = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    role = profileSnapshot.exists
      ? String(
          profileSnapshot.data()?.role || ""
        )
      : "";
  }

  if (!ALLOWED_ROLES.has(role)) {
    return null;
  }

  return {
    uid: decoded.uid,
    role,
  };
}

async function consumeUploadQuota(
  uid: string
) {
  const quotaRef = adminDb
    .collection("uploadRateLimits")
    .doc(uid);

  return adminDb.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(quotaRef);

      const data = snapshot.exists
        ? snapshot.data() || {}
        : {};

      const now = Date.now();
      const windowStart = Number(
        data.windowStart || 0
      );

      const inCurrentWindow =
        windowStart > 0 &&
        now - windowStart < 60_000;

      const count = inCurrentWindow
        ? Number(data.count || 0)
        : 0;

      if (
        inCurrentWindow &&
        count >= MAX_UPLOADS_PER_MINUTE
      ) {
        return false;
      }

      transaction.set(
        quotaRef,
        {
          windowStart: inCurrentWindow
            ? windowStart
            : now,
          count: count + 1,
          updatedAt: now,
        },
        { merge: true }
      );

      return true;
    }
  );
}

export async function POST(request: Request) {
  try {
    const authorized =
      await authorizeUpload(request);

    if (!authorized) {
      return json(
        {
          error:
            "You are not authorized to upload images.",
        },
        401
      );
    }

    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_REQUEST_SIZE
    ) {
      return json(
        {
          error:
            "Upload request is too large.",
        },
        413
      );
    }

    const allowed =
      await consumeUploadQuota(
        authorized.uid
      );

    if (!allowed) {
      return json(
        {
          error:
            "Too many uploads. Please wait one minute.",
        },
        429
      );
    }

    const formData =
      await request.formData();

    const value = formData.get("file");

    if (!(value instanceof File)) {
      return json(
        { error: "No image uploaded." },
        400
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(value.type)) {
      return json(
        {
          error:
            "Only JPG, PNG, WebP and AVIF images are allowed.",
        },
        415
      );
    }

    if (
      value.size <= 0 ||
      value.size > MAX_IMAGE_SIZE
    ) {
      return json(
        {
          error:
            "Image must be smaller than 10 MB.",
        },
        413
      );
    }

    const bytes =
      await value.arrayBuffer();

    const buffer = Buffer.from(bytes);

    if (
      !hasValidImageSignature(
        buffer,
        value.type
      )
    ) {
      return json(
        {
          error:
            "Uploaded file does not match a valid image format.",
        },
        415
      );
    }

    const result = await new Promise<any>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `propertyhub/${authorized.uid}`,
              resource_type: "image",
              allowed_formats: [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "avif",
              ],
              overwrite: false,
            },
            (error, uploadResult) => {
              if (error || !uploadResult) {
                reject(
                  error ||
                    new Error(
                      "Missing upload result"
                    )
                );
                return;
              }

              resolve(uploadResult);
            }
          )
          .end(buffer);
      }
    );

    return json(
      {
        secure_url: result.secure_url,
      },
      200
    );
  } catch (error: unknown) {
    console.error(
      "SECURE_UPLOAD_ERROR",
      error instanceof Error
        ? error.name
        : "UnknownError"
    );

    return json(
      {
        error:
          "Image upload failed. Please try again.",
      },
      500
    );
  }
}
