"use client";

import { useState } from "react";
import useProperties from "@/hooks/useProperties";

import PropertyCard from "../../components/PropertyCard";
import PropertyFilters from "../../components/PropertyFilters";
import Navbar from "../../components/Navbar";

export default function PropertiesPage() {

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    bhk: "",
  });


  const { properties, loading } = useProperties();

  const filteredProperties = properties.filter((property) => {

    const searchText =
      `${property.title} ${property.builder}`
      .toLowerCase()
      .includes(filters.search.toLowerCase());


    const locationMatch =
      property.location
      .toLowerCase()
      .includes(filters.location.toLowerCase());


    const bhkMatch =
      filters.bhk === ""
      ? true
      : property.bedrooms === Number(filters.bhk);


    return searchText && locationMatch && bhkMatch;

  });



  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Loading properties...
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 py-10">

        <div className="mx-auto max-w-7xl px-6">


          <h1 className="mb-8 text-4xl font-bold">
            🏠 Explore Properties
          </h1>


          <PropertyFilters
            onFilterChange={setFilters}
          />

          <div className="mb-8 rounded-xl bg-zinc-900 px-6 py-4 shadow">
            <p className="text-lg font-semibold text-gray-700">
              🏠 {filteredProperties.length} Properties Found
            </p>
          </div>



          {filteredProperties.length === 0 ? (

            <div className="rounded-2xl bg-zinc-900 p-10 text-center shadow">

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
