import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

async function searchNearby(
  lat: string,
  lng: string,
  type: string
) {
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=2000` +
    `&type=${type}` +
    `&key=${API_KEY}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Google Places API request failed");
  }

  const data = await res.json();

  console.log("GOOGLE PLACES RESPONSE", {
    type,
    status: data.status,
    error: data.error_message,
    count: data.results?.length || 0
  });

  return {
    status: data.status,
    error: data.error_message || null,
    results: (data.results || []).slice(0, 5)
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Latitude & Longitude required" },
      { status: 400 }
    );
  }

  try {
    const [
      colleges,
      schools,
      hospitals,
      restaurants,
      malls,
      banks,
    ] = await Promise.all([
      searchNearby(lat, lng, "university"),
      searchNearby(lat, lng, "school"),
      searchNearby(lat, lng, "hospital"),
      searchNearby(lat, lng, "restaurant"),
      searchNearby(lat, lng, "shopping_mall"),
      searchNearby(lat, lng, "bank"),
    ]);

    return NextResponse.json({
      colleges,
      schools,
      hospitals,
      restaurants,
      malls,
      banks,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 }
    );
  }
}