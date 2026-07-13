"use client";

import { useState } from "react";

export default function PropertySearch() {
  const [search, setSearch] = useState("");
  const [bhk, setBhk] = useState("All");

  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-3xl font-bold">
        🔍 Advanced Property Search
      </h2>

      <div className="grid gap-5 md:grid-cols-3">

        <input
          type="text"
          placeholder="Search City, Builder..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border p-4"
        />

        <select
          value={bhk}
          onChange={(e) => setBhk(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option>All</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
        </select>

        <button className="rounded-xl bg-blue-600 p-4 font-bold text-white hover:bg-blue-700">
          Search
        </button>

      </div>

      <p className="mt-5 text-gray-600">
        Search: <b>{search || "All"}</b> | BHK: <b>{bhk}</b>
      </p>
    </section>
  );
}