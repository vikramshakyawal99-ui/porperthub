"use client";

import Link from "next/link";
import useProperties from "@/hooks/useProperties";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  const { properties, loading } = useProperties();

  const featured = properties.slice(0, 8);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-5xl font-black tracking-tight text-slate-900">
            Featured Properties
          </h2>
          <p className="mt-4 text-slate-600">
            Loading properties...
          </p>
        </div>
      </section>
    );
  }


  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-blue-50">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 flex flex-col items-center text-center">

          <p className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
            ⭐ Premium Collection
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
            Featured Properties
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Explore verified properties selected specially for you.
          </p>

        </div>


        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-10">

          {featured.map((property)=>(
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}

        </div>


        <div className="mt-12 text-center">

          <Link
            href="/properties"
            className="
              inline-block rounded-xl
              bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4
              font-black text-white shadow-xl
              transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl
            "
          >
            View All Properties →
          </Link>

        </div>


      </div>

    </section>
  );
}
