"use client";

import Link from "next/link";
import useProperties from "@/hooks/useProperties";
import { properties as oldProperties } from "@/data/properties";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  const { properties, loading } = useProperties();

  const legacyProperties = oldProperties.map((property) => ({
    ...property,
    propertyType:
      property.type?.toLowerCase() === "apartment"
        ? "flat"
        : property.type?.toLowerCase() === "flat"
        ? "flat"
        : property.type?.toLowerCase() === "villa"
        ? "villa"
        : property.type?.toLowerCase(),
    purpose: "new",
    propertyCondition: "new",
  }));

  const featured = [
    ...legacyProperties,
    ...properties,
  ].slice(0, 8);

  if (loading) {
    return (
      <section className="bg-[#F8FAF8] py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-lg text-slate-500">
            Loading properties...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8FAF8] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 text-center">

          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold text-green-700">
            ⭐ Featured Collection
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Find A Place That Feels Like Home
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Explore verified properties selected to help you find the right
            place with confidence.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {featured.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}

        </div>

        <div className="mt-10 text-center">
          <Link
            href="/properties"
            className="
              inline-block
              rounded-xl
              bg-green-600
              px-10 py-4
              font-black
              text-white
              shadow-sm
              transition
              hover:bg-green-700
              hover:shadow-md
            "
          >
            View All Properties →
          </Link>
        </div>

      </div>
    </section>
  );
}
