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
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
        <p className="font-semibold text-slate-700">
          📍 Map location not available
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-xl">
        <p className="font-semibold text-slate-700">
          🗺️ Loading Map...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

      <h2 className="mb-5 text-3xl font-extrabold text-slate-900">
        📍 Property Location
      </h2>

      {location && (
        <div className="mb-5 rounded-2xl bg-slate-50 px-5 py-3 font-semibold text-slate-700">
          {location}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl shadow-lg">
        <Map
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          <Marker position={center} />
        </Map>
      </div>

    </section>
  );
}
