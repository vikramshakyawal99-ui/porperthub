"use client";

import { useState } from "react";
import { properties } from "../../data/properties";
import PropertyCard from "../../components/PropertyCard";
import Navbar from "../../components/Navbar";

export default function PropertiesPage() {

  const [search, setSearch] = useState("");

  const filteredProperties = properties.filter((property) => {

    const text =
      `${property.title} ${property.location} ${property.builder}`
        .toLowerCase();

    return text.includes(search.toLowerCase());

  });


  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 py-10">

        <div className="mx-auto max-w-7xl px-6">

          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            🏠 All Properties
          </h1>


          <div className="mb-10 rounded-2xl bg-white p-6 shadow">

            <input
              type="text"
              placeholder="Search property, city or builder..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full rounded-xl border px-5 py-4 outline-none focus:border-blue-600"
            />

          </div>



          {filteredProperties.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              <h2 className="text-3xl font-bold">
                No Property Found
              </h2>

            </div>


          ) : (

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {filteredProperties.map((property)=>(

                <PropertyCard
                  key={property.id}
                  property={property}
                />

              ))}

            </div>

          )}


        </div>

      </main>
    </>
  );
}
