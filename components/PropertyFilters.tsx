"use client";

import { useState } from "react";

export default function PropertyFilters() {
  const [search, setSearch] = useState("");

  return (
    <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">
        Search Properties
      </h2>

      <input
        type="text"
        placeholder="Search by city or property name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border px-4 py-3 outline-none"
      />
    </div>
  );
}