"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatsCounter from "./StatsCounter";
import InvestSmarter from "./InvestSmarter";

const categories = ["Buy", "Rent", "PG", "Hostel", "Plot"];

const searchOptions: Record<
  string,
  { label: string; type: string; purpose: string; gender?: string; suitableFor?: string }[]
> = {
  Buy: [
    { label: "Flat", type: "flat", purpose: "buy" },
    { label: "Villa", type: "villa", purpose: "buy" },
    { label: "Resale House", type: "house", purpose: "buy" },
    { label: "Plot", type: "plot", purpose: "buy" },
  ],

  Rent: [
    { label: "Flat Rent", type: "flat", purpose: "rent" },
    { label: "House Rent", type: "house", purpose: "rent" },
    { label: "Room", type: "room_rent", purpose: "rent" },
  ],

  PG: [
    { label: "Boys PG", type: "pg", purpose: "rent", gender: "boys" },
    { label: "Girls PG", type: "pg", purpose: "rent", gender: "girls" },
    {
      label: "Co-Living PG",
      type: "pg",
      purpose: "rent",
      suitableFor: "co_living",
    },
  ],

  Hostel: [
    { label: "Boys Hostel", type: "hostel", purpose: "rent", gender: "boys" },
    { label: "Girls Hostel", type: "hostel", purpose: "rent", gender: "girls" },
  ],

  Plot: [
    { label: "JDA Approved Plot", type: "plot", purpose: "buy" },
    { label: "Society Plot", type: "plot", purpose: "buy" },
  ],
};

export default function Hero() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  const selectedOption = searchOptions[category]?.find(
    (item) => item.label === type
  );

  function handleSearch() {
    const params = new URLSearchParams();

    if (selectedOption?.purpose) {
      params.set("purpose", selectedOption.purpose);
    } else if (category) {
      params.set("purpose", category.toLowerCase());
    }

    if (selectedOption?.type) {
      params.set("type", selectedOption.type);
    }

    if (selectedOption?.gender) {
      params.set("gender", selectedOption.gender);
    }

    if (selectedOption?.suitableFor) {
      params.set("suitableFor", selectedOption.suitableFor);
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (budget) {
      params.set("budget", budget);
    }

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[680px] lg:min-h-[700px] overflow-hidden bg-slate-50">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/hero-property.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        {/* DARK LEFT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A] via-[#05070A]/90 to-[#05070A]/20" />

        {/* TOP / BOTTOM BLEND */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/45" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(34,197,94,0.16),transparent_35%)]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 min-h-[680px] lg:min-h-[700px] flex items-center translate-y-12 lg:translate-y-14">

        <div className="w-full lg:w-[54%] py-16 lg:py-20">

          {/* LABEL */}
          <span className="inline-flex rounded-full border border-green-200 bg-white px-5 py-2 text-green-700 shadow-sm text-xs tracking-[0.18em] uppercase">
            Real Estate Platform
          </span>

          {/* HEADING */}
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[68px] font-serif font-semibold leading-[1.02] tracking-tight text-slate-950">
            Discover Spaces
            <br />
            <span className="text-green-600">
              Designed For
            </span>
            <br />
            <span className="text-green-600">
              Your Lifestyle
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mt-6 text-slate-600 text-lg max-w-lg leading-relaxed">
            Find A Place That Feels Like Home
          </p>

          {/* CATEGORY */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(category === item ? "" : item);
                  setType("");
                }}
                className={`px-5 py-2.5 rounded-full border transition-all ${
                  category === item
                    ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PROPERTY TYPE */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {searchOptions[category]?.map((item) => (
              <button
                key={item.label}
                onClick={() => setType(item.label)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  type === item.label
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="mt-7 max-w-2xl rounded-3xl border border-green-100 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col md:flex-row gap-2">

              <input
                placeholder="Search location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <input
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="md:w-40 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100"
              />

              <button
                onClick={handleSearch}
                className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg"
              >
                Search
              </button>

            </div>
          </div>

          {/* STATS */}
          <div className="mt-7 max-w-2xl rounded-3xl border border-green-100 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-3 gap-4 text-center">

              <StatsCounter
                end={500}
                label="Properties"
              />

              <StatsCounter
                end={50}
                label="Builders"
              />

              <StatsCounter
                end={10}
                label="Cities"
              />

            </div>
          </div>

          {/* INVEST SMARTER */}
          <div className="hidden lg:flex absolute right-6 xl:right-10 top-[calc(50%_+_30px)] -translate-y-1/2 w-[520px] justify-end">
            <InvestSmarter />
          </div>

        </div>
      </div>
    </section>
  );
}
