"use client";

import {
  FormEvent,
  useState,
} from "react";

type Props = {
  location: string;
  latitude: number;
  longitude: number;
};

const examples = [
  "Office",
  "School",
  "Hospital",
  "Railway Station",
];

export default function NearbyPlaces({
  location,
  latitude,
  longitude,
}: Props) {
  const [destination, setDestination] =
    useState("");

  const validCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  function checkDistance(
    event?: FormEvent
  ) {
    event?.preventDefault();

    const query = destination.trim();

    if (!query) {
      alert(
        "Please enter an office, school, landmark or address."
      );
      return;
    }

    if (!validCoordinates) {
      alert(
        "Property coordinates are unavailable."
      );
      return;
    }

    const url =
      "https://www.google.com/maps/dir/?api=1" +
      "&origin=" +
      encodeURIComponent(
        `${latitude},${longitude}`
      ) +
      "&destination=" +
      encodeURIComponent(query) +
      "&travelmode=driving";

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="mt-12 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_12px_35px_rgba(20,83,45,0.08)]">
      <div className="bg-gradient-to-r from-green-50 to-white p-6 sm:p-8">
        <span className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-700">
          Distance & Directions
        </span>

        <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Check Distance From This Property
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Search your office, children&apos;s school,
          college, market or any other destination.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <span className="text-green-600">
            ●
          </span>

          Starting from{" "}
          <strong className="text-slate-900">
            {location}
          </strong>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <form
          onSubmit={checkDistance}
          className="flex flex-col gap-3 md:flex-row"
        >
          <label className="flex min-h-16 flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100">
            <span className="mr-3 text-xl text-green-700">
              ⌕
            </span>

            <input
              type="text"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
              placeholder="Search office, school or any location..."
              className="w-full border-0 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
            />
          </label>

          <button
            type="submit"
            disabled={
              !destination.trim() ||
              !validCoordinates
            }
            className="min-h-16 rounded-2xl bg-green-600 px-8 text-sm font-black text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            GO →
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold text-slate-500">
            Try:
          </span>

          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() =>
                setDestination(example)
              }
              className="rounded-full border border-green-100 bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:border-green-300 hover:bg-green-100"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs leading-6 text-slate-500">
            Google Maps will open with this property as
            the starting point and show the road distance,
            estimated travel time and complete route to
            your searched destination.
          </p>
        </div>
      </div>
    </section>
  );
}
