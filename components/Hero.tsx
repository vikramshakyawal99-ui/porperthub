"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatsCounter from "./StatsCounter";

const categories = ["Buy", "Rent", "PG", "Hostel", "Plot"];

const searchOptions: any = {
  Buy: ["Flat", "Villa", "Resale House", "Plot"],
  Rent: ["Flat Rent", "House Rent", "Room"],
  PG: ["Boys PG", "Girls PG", "Co-Living PG"],
  Hostel: ["Boys Hostel", "Girls Hostel"],
  Plot: ["JDA Approved Plot", "Society Plot"],
};

export default function Hero() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();

    params.set("purpose", category.toLowerCase());

    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (budget) params.set("budget", budget);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative min-h-[680px] lg:min-h-[700px] overflow-hidden bg-[#17130f]">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/property-hero.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        {/* DARK LEFT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17130f] via-[#17130f]/90 to-[#17130f]/20" />

        {/* TOP / BOTTOM BLEND */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#17130f]/65 via-transparent to-[#17130f]/80" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(212,168,85,0.16),transparent_35%)]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 min-h-[680px] lg:min-h-[700px] flex items-center translate-y-12 lg:translate-y-14">

        <div className="w-full lg:w-[54%] py-16 lg:py-20">

          {/* LABEL */}
          <span className="inline-flex px-5 py-2 rounded-full border border-[#d4a855]/40 bg-[#211b15]/60 backdrop-blur-md text-[#e5c27a] text-xs tracking-[0.18em] uppercase">
            Real Estate Platform
          </span>

          {/* HEADING */}
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-[68px] font-serif font-semibold leading-[0.98] tracking-tight text-white">
            Discover Spaces
            <br />
            <span className="text-[#d4a855]">
              Designed For
            </span>
            <br />
            <span className="text-[#d4a855]">
              Your Lifestyle
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mt-6 text-[#d6cfc4] text-lg max-w-lg leading-relaxed">
            Find A Place That Feels Like Home
          </p>

          {/* CATEGORY */}
          <div className="flex flex-wrap gap-3 mt-8">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCategory(category === item ? "" : item);
                  setType("");
                }}
                className={`px-5 py-2.5 rounded-full border transition-all ${
                  category === item
                    ? "bg-[#d4a855] text-[#17130f] border-[#d4a855] shadow-lg shadow-[#d4a855]/25"
                    : "border-[#d4a855]/30 bg-[#17130f]/45 backdrop-blur-md text-[#eee5d8] hover:border-[#d4a855]/70 hover:bg-[#d4a855]/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PROPERTY TYPE */}
          <div className="mt-4 flex flex-wrap gap-3">
            {searchOptions[category]?.map((item: string) => (
              <button
                key={item}
                onClick={() => setType(item)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  type === item
                    ? "bg-[#d4a855] text-[#17130f] border-[#d4a855]"
                    : "border-white/15 bg-[#17130f]/40 backdrop-blur-md text-[#d0c7b9] hover:border-[#d4a855]/50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="mt-7 p-2 rounded-2xl bg-[#211b15]/65 backdrop-blur-xl border border-[#d4a855]/25 shadow-2xl max-w-2xl">
            <div className="flex flex-col md:flex-row gap-2">

              <input
                placeholder="Search location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-5 py-4 rounded-xl bg-[#17130f]/70 text-[#eee5d8] placeholder:text-[#9f9586] border border-[#d4a855]/20 outline-none"
              />

              <input
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="md:w-40 px-5 py-4 rounded-xl bg-[#17130f]/70 text-[#eee5d8] placeholder:text-[#9f9586] border border-[#d4a855]/20 outline-none"
              />

              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-[#d4a855] hover:bg-[#e1b968] text-[#17130f] rounded-xl font-bold transition-all shadow-lg shadow-[#d4a855]/25"
              >
                Search
              </button>

            </div>
          </div>

          {/* STATS */}
          <div className="mt-8 max-w-2xl rounded-2xl bg-[#211b15]/75 backdrop-blur-xl border border-[#d4a855]/30 px-5 py-5 shadow-2xl">
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

        </div>
      </div>
    </section>
  );
}
