import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

function json(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function authorize(request: Request) {
  const authorization =
    request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization
    .slice("Bearer ".length)
    .trim();

  if (!token) {
    return null;
  }

  try {
    const decoded =
      await adminAuth.verifyIdToken(
        token,
        true
      );

    return {
      uid: decoded.uid,
    };
  } catch {
    return null;
  }
}

async function getPropertyForUser(
  propertyId: string,
  uid: string
) {
  const propertySnapshot =
    await adminDb
      .collection("properties")
      .doc(propertyId)
      .get();

  if (!propertySnapshot.exists) {
    return null;
  }

  const data =
    propertySnapshot.data() || {};

  const isOwner =
    String(data.ownerId || "") === uid;

  const isDealer =
    String(data.dealerId || "") === uid;

  const isHandler =
    String(data.contactHandlerUid || "") ===
      uid ||
    String(data.addedByUid || "") === uid;

  if (
    !isOwner &&
    !isDealer &&
    !isHandler
  ) {
    return null;
  }

  return data;
}

/*
 * GET
 * Owner/dealer/team handler analytics.
 *
 * Returns only aggregate numbers.
 * Saver identities are never returned.
 */
export async function GET(request: Request) {
  const authUser = await authorize(request);

  if (!authUser) {
    return json(
      { error: "Unauthorized" },
      401
    );
  }

  const url = new URL(request.url);

  const propertyId =
    url.searchParams
      .get("propertyId")
      ?.trim() || "";

  if (!propertyId) {
    return json(
      { error: "Property ID required" },
      400
    );
  }

  const property =
    await getPropertyForUser(
      propertyId,
      authUser.uid
    );

  if (!property) {
    return json(
      { error: "Property unavailable" },
      403
    );
  }

  const [
    savedSnapshot,
    callSnapshot,
  ] = await Promise.all([
    adminDb
      .collection("savedProperties")
      .where(
        "propertyId",
        "==",
        propertyId
      )
      .count()
      .get(),

    adminDb
      .collection("propertyCallStats")
      .doc(propertyId)
      .get(),
  ]);

  const saves =
    savedSnapshot.data().count || 0;

  const callTaps =
    callSnapshot.exists
      ? Number(
          callSnapshot.data()?.callTaps || 0
        )
      : 0;

  return json({
    propertyId,
    saves,
    callTaps,
  });
}

/*
 * POST
 * Records a genuine authenticated
 * call-button tap.
 */
export async function POST(request: Request) {
  const authUser = await authorize(request);

  if (!authUser) {
    return json(
      { error: "Unauthorized" },
      401
    );
  }

  let body: {
    propertyId?: string;
    action?: string;
  };

  try {
    body = await request.json();
  } catch {
    return json(
      { error: "Invalid request" },
      400
    );
  }

  const propertyId =
    String(body.propertyId || "").trim();

  if (
    !propertyId ||
    body.action !== "call"
  ) {
    return json(
      { error: "Invalid analytics event" },
      400
    );
  }

  const propertySnapshot =
    await adminDb
      .collection("properties")
      .doc(propertyId)
      .get();

  if (!propertySnapshot.exists) {
    return json(
      { error: "Property not found" },
      404
    );
  }

  const property =
    propertySnapshot.data() || {};

  if (
    String(property.status || "")
      .toLowerCase() !== "approved"
  ) {
    return json(
      { error: "Property unavailable" },
      403
    );
  }

  /*
   * Do not count owner/dealer/handler
   * tapping their own Call button.
   */
  const ownProperty =
    String(property.ownerId || "") ===
      authUser.uid ||
    String(property.dealerId || "") ===
      authUser.uid ||
    String(
      property.contactHandlerUid || ""
    ) === authUser.uid ||
    String(property.addedByUid || "") ===
      authUser.uid;

  if (ownProperty) {
    return json({
      success: true,
      counted: false,
    });
  }

  const statsRef =
    adminDb
      .collection("propertyCallStats")
      .doc(propertyId);

  await statsRef.set(
    {
      propertyId,
      callTaps:
        FieldValue.increment(1),
      updatedAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return json({
    success: true,
    counted: true,
  });
}
