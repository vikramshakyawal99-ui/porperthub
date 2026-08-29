import { createHash } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";

type Category =
  | "hospital"
  | "school"
  | "college"
  | "mall"
  | "railway"
  | "metro"
  | "bus";

type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  googleMapsUrl: string;
  category: Category;
};

const OVERPASS_URL =
  "https://z.overpass-api.de/api/interpreter";

const RADIUS_METERS = 5000;
const MAX_RESULTS = 5;

const NEARBY_RATE_WINDOW_MS = 10 * 60 * 1000;
const NEARBY_MAX_REQUESTS = 60;

function getClientIp(request: Request) {
  const forwarded =
    request.headers.get("x-forwarded-for");

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

async function consumeNearbyQuota(
  request: Request
) {
  const ipHash = hashClientIp(
    getClientIp(request)
  );

  const ref = adminDb
    .collection("nearbyApiRateLimits")
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

      const count = Number(
        data.count || 0
      );

      if (
        !windowStartedAt ||
        now - windowStartedAt >=
          NEARBY_RATE_WINDOW_MS
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
        count >= NEARBY_MAX_REQUESTS
      ) {
        return false;
      }

      transaction.update(ref, {
        count:
          FieldValue.increment(1),
        updatedAt:
          FieldValue.serverTimestamp(),
      });

      return true;
    }
  );
}

function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function categoryForTags(tags: Record<string, string>) {
  if (
    tags.amenity === "hospital" ||
    tags.healthcare === "hospital" ||
    tags.healthcare === "clinic"
  ) {
    return "hospital" as Category;
  }

  if (
    tags.amenity === "school"
  ) {
    return "school" as Category;
  }

  if (
    tags.amenity === "college" ||
    tags.amenity === "university"
  ) {
    return "college" as Category;
  }

  if (
    tags.shop === "mall"
  ) {
    return "mall" as Category;
  }

  if (
    tags.railway === "station"
  ) {
    return "railway" as Category;
  }

  if (
    tags.railway === "subway" ||
    tags.station === "subway"
  ) {
    return "metro" as Category;
  }

  if (
    tags.highway === "bus_stop" ||
    tags.amenity === "bus_station"
  ) {
    return "bus" as Category;
  }

  return null;
}

function cleanAddress(tags: Record<string, string>) {
  return [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
  ]
    .filter(Boolean)
    .join(", ");
}

function getName(tags: Record<string, string>) {
  return (
    tags.name ||
    tags["name:en"] ||
    tags["official_name"] ||
    "Nearby Place"
  );
}

async function fetchOverpass(
  lat: number,
  lng: number
) {
  const query = `
[out:json][timeout:20];

(
  nwr["amenity"="hospital"](around:${RADIUS_METERS},${lat},${lng});
  nwr["healthcare"="hospital"](around:${RADIUS_METERS},${lat},${lng});
  nwr["healthcare"="clinic"](around:${RADIUS_METERS},${lat},${lng});

  nwr["amenity"="school"](around:${RADIUS_METERS},${lat},${lng});

  nwr["amenity"="college"](around:${RADIUS_METERS},${lat},${lng});
  nwr["amenity"="university"](around:${RADIUS_METERS},${lat},${lng});

  nwr["shop"="mall"](around:${RADIUS_METERS},${lat},${lng});

  nwr["railway"="station"](around:${RADIUS_METERS},${lat},${lng});

  nwr["railway"="subway"](around:${RADIUS_METERS},${lat},${lng});
  nwr["station"="subway"](around:${RADIUS_METERS},${lat},${lng});

  nwr["highway"="bus_stop"](around:${RADIUS_METERS},${lat},${lng});
  nwr["amenity"="bus_station"](around:${RADIUS_METERS},${lat},${lng});
);

out center tags;
`;

  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    25000
  );

  try {
    const response = await fetch(
      OVERPASS_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",
          Referer:
            "http://localhost:3000/",
        },

        body:
          "data=" +
          encodeURIComponent(query),

        signal: controller.signal,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Overpass error ${response.status}: ${errorText.slice(
          0,
          300
        )}`
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function buildPlaces(
  elements: any[],
  lat: number,
  lng: number
) {
  const seen = new Set<string>();

  const places: Place[] = [];

  for (const element of elements || []) {
    const tags =
      element.tags || {};

    const category =
      categoryForTags(tags);

    if (!category) {
      continue;
    }

    let placeLat = Number(
      element.lat
    );

    let placeLng = Number(
      element.lon
    );

    if (
      !Number.isFinite(placeLat) ||
      !Number.isFinite(placeLng)
    ) {
      placeLat = Number(
        element.center?.lat
      );

      placeLng = Number(
        element.center?.lon
      );
    }

    if (
      !Number.isFinite(placeLat) ||
      !Number.isFinite(placeLng)
    ) {
      continue;
    }

    const distance =
      distanceKm(
        lat,
        lng,
        placeLat,
        placeLng
      );

    if (
      distance * 1000 >
      RADIUS_METERS
    ) {
      continue;
    }

    const name =
      getName(tags);

    const key =
      `${category}|${name.toLowerCase()}|${placeLat.toFixed(
        5
      )}|${placeLng.toFixed(5)}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    places.push({
      name,

      address:
        cleanAddress(tags),

      lat: placeLat,

      lng: placeLng,

      distance:
        Number(
          distance.toFixed(2)
        ),

      googleMapsUrl:
        mapsUrl(
          placeLat,
          placeLng
        ),

      category,
    });
  }

  return places;
}

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const lat = Number(
      searchParams.get("lat")
    );

    const lng = Number(
      searchParams.get("lng")
    );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid latitude or longitude",
        },
        { status: 400 }
      );
    }

    const withinQuota =
      await consumeNearbyQuota(req);

    if (!withinQuota) {
      return NextResponse.json(
        {
          error:
            "Too many nearby requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    const data =
      await fetchOverpass(
        lat,
        lng
      );

    const allPlaces =
      buildPlaces(
        data.elements || [],
        lat,
        lng
      );

    const result: Record<
      Category,
      Place[]
    > = {
      hospital: [],
      school: [],
      college: [],
      mall: [],
      railway: [],
      metro: [],
      bus: [],
    };

    for (const category of Object.keys(
      result
    ) as Category[]) {
      result[category] =
        allPlaces
          .filter(
            (place) =>
              place.category ===
              category
          )
          .sort(
            (a, b) =>
              a.distance -
              b.distance
          )
          .slice(
            0,
            MAX_RESULTS
          );
    }

    return NextResponse.json(
      result
    );
  } catch (error: unknown) {
    console.error(
      "NEARBY_API_ERROR",
      error instanceof Error
        ? error.name
        : "UnknownError"
    );

    return NextResponse.json(
      {
        error:
          "Unable to load nearby places. Please try again later.",
      },
      { status: 500 }
    );
  }
}
