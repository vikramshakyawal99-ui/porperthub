"use client";

import {
  GoogleMap as Map,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";

type Props = {
  location?: string;
  latitude: number | string;
  longitude: number | string;
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function GoogleMap({
  location,
  latitude,
  longitude,
}: Props) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat: Number(latitude),
    lng: Number(longitude),
  };

  if (
    !Number.isFinite(center.lat) ||
    !Number.isFinite(center.lng)
  ) {
    return (
      <div className="rounded-xl bg-gray-100 p-5 text-center">
        Invalid map location
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-xl bg-gray-100 p-5 text-center">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl">

      {location && (
        <div className="mb-3 rounded-xl bg-gray-100 p-3 font-semibold">
          📍 {location}
        </div>
      )}

      <Map
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </Map>

    </div>
  );
}
