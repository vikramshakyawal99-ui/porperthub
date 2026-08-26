import { NextResponse } from "next/server";

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
      !Number.isFinite(lng)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid latitude or longitude",
        },
        { status: 400 }
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
  } catch (error: any) {
    console.error(
      "Nearby OSM error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load nearby places",
        message:
          error?.name ===
          "AbortError"
            ? "Nearby places request timed out"
            : error?.message ||
              "Unknown error",
      },
      { status: 500 }
    );
  }
}
