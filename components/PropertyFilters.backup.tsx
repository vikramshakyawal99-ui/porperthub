"use client";

import { useState } from "react";

type Props = {
  onFilterChange: (filters: {
    search: string;
    location: string;
    bhk: string;
  }) => void;
};

export default function PropertyFilters({
  onFilterChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");

  function updateFilters(
    newSearch: string,
    newLocation: string,
    newBhk: string
  ) {
    onFilterChange({
      search: newSearch,
      location: newLocation,
      bhk: newBhk,
    });
  }

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">
        🔍 Search & Filters
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search Property..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            updateFilters(value, location, bhk);
          }}
          className="rounded-xl border p-3"
        />

        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => {
            const value = e.target.value;
            setLocation(value);
            updateFilters(search, value, bhk);
          }}
          className="rounded-xl border p-3"
        />

        <select
          value={bhk}
          onChange={(e) => {
            const value = e.target.value;
            setBhk(value);
            updateFilters(search, location, value);
          }}
          className="rounded-xl border p-3"
        >
          <option value="">All BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
        </select>
      </div>

      <button
        onClick={() => {
          setSearch("");
          setLocation("");
          setBhk("");

          onFilterChange({
            search: "",
            location: "",
            bhk: "",
          });
        }}
        className="mt-6 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
      >
        Clear Filters
      </button>
    </div>
  );
}