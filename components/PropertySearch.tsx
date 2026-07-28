"use client";

import { useState } from "react";
import useProperties from "../hooks/useProperties";
import PropertyCard from "./PropertyCard";

export default function PropertySearch() {
  const { properties, loading } = useProperties();

  const [search, setSearch] = useState("");
  const [bhk, setBhk] = useState("All");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("All");

  if (loading) {
    return (
      <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-zinc-900 p-8 text-center text-white">
        Loading properties...
      </section>
    );
  }

  const filteredProperties = properties.filter((property) => {

    const text =
      `${property.title || ""} ${property.location || ""} ${property.builder || ""}`
        .toLowerCase();

    const searchMatch =
      text.includes(search.toLowerCase());


    const bhkMatch =
      bhk === "All" ||
      property.propertyType === "pg" ||
      property.propertyType === "hostel" ||
      property.propertyType === "room_rent" ||
      `${property.bedrooms} BHK` === bhk;


    const typeMatch =
      type === "All" ||
      property.propertyType === type;


    const price = parseFloat(
      String(property.price || "")
        .replace(/[^0-9.]/g, "")
    );


    const budgetMatch =
      budget === "All" ||
      (budget === "0-60" && price <= 60) ||
      (budget === "60-100" && price > 60 && price <= 100) ||
      (budget === "100+" && price > 100);


    return (
      searchMatch &&
      bhkMatch &&
      typeMatch &&
      budgetMatch
    );
  });


  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-zinc-900 p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">
        🔍 Find Your Perfect Property
      </h2>


      <div className="grid gap-5 md:grid-cols-5">


        <input
          type="text"
          placeholder="Search City, Builder, Project..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="rounded-xl border p-4"
        />


        <select
          value={bhk}
          onChange={(e)=>setBhk(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option>All</option>
          <option>1 BHK</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
        </select>



        <select
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option value="All">All Types</option>

          <option value="flat">
            Flat
          </option>

          <option value="villa">
            Villa
          </option>

          <option value="apartment">
            Apartment
          </option>

          <option value="penthouse">
            Penthouse
          </option>

          <option value="pg">
            PG
          </option>

          <option value="hostel">
            Hostel
          </option>

          <option value="room_rent">
            Room
          </option>

        </select>



        <select
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
          className="rounded-xl border p-4"
        >

          <option value="All">
            All Budgets
          </option>

          <option value="0-60">
            Below ₹60 Lakh
          </option>

          <option value="60-100">
            ₹60 Lakh - ₹1 Cr
          </option>

          <option value="100+">
            Above ₹1 Cr
          </option>

        </select>


        <div className="rounded-xl bg-blue-600 p-4 text-center font-bold text-white">
          {filteredProperties.length} Properties Found
        </div>

      </div>



      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {filteredProperties.map((property)=>(
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}

      </div>


    </section>
  );
}
