"use client";

import { useState } from "react";
import { properties } from "../data/properties";
import PropertyCard from "./PropertyCard";

export default function PropertySearch() {
  const [search, setSearch] = useState("");
  const [bhk, setBhk] = useState("All");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("All");

  const filteredProperties = properties.filter((property) => {
    const text =
      `${property.title} ${property.location} ${property.builder}`.toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const bhkMatch =
      bhk === "All" ||
      `${property.bedrooms} BHK` === bhk;

    const typeMatch =
      type === "All" ||
      property.type === type;

    let budgetMatch = true;

    if (budget === "50") {
      budgetMatch =
        Number(property.price.replace(/[^\d]/g, "")) <= 50;
    }

    if (budget === "100") {
      budgetMatch =
        Number(property.price.replace(/[^\d]/g, "")) <= 100;
    }

    if (budget === "200") {
      budgetMatch =
        Number(property.price.replace(/[^\d]/g, "")) <= 200;
    }

    return (
      searchMatch &&
      bhkMatch &&
      typeMatch &&
      budgetMatch
    );
  });

  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">
        🔍 Advanced Property Search
      </h2>

      <div className="grid gap-5 md:grid-cols-4">

        <input
          type="text"
          placeholder="City, Builder, Project..."
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


        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option>All</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Flat</option>
          <option>Penthouse</option>
        </select>


        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option value="All">Any Budget</option>
          <option value="50">Under ₹50 Lakh</option>
          <option value="100">Under ₹1 Cr</option>
          <option value="200">Under ₹2 Cr</option>
        </select>

      </div>


      <p className="mt-6 text-lg font-semibold">
        🏠 {filteredProperties.length} Properties Found
      </p>


      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}

      </div>

    </section>
  );
}