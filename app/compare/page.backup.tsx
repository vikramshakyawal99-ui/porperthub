"use client";

import { useMemo } from "react";
import Link from "next/link";
import { properties } from "../../data/properties";

export default function ComparePage() {
  const compareIds = useMemo(() => {
    if (typeof window === "undefined") return [];

    return JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    ) as number[];
  }, []);

  const compareProperties = properties.filter((property) =>
    compareIds.includes(property.id)
  );

  if (compareProperties.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            No Properties Selected
          </h1>

          <p className="mt-4 text-gray-600">
            Add properties from the Property Details page to compare them.
          </p>

          <Link
            href="/properties"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-8 text-4xl font-bold">
          ⚖️ Compare Properties
        </h1>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-xl">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Feature</th>

                {compareProperties.map((property) => (
                  <th
                    key={property.id}
                    className="p-4 text-left"
                  >
                    {property.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>

              <Row
                title="Price"
                values={compareProperties.map((p) => p.price)}
              />

              <Row
                title="Location"
                values={compareProperties.map((p) => p.location)}
              />

              <Row
                title="Builder"
                values={compareProperties.map((p) => p.builder)}
              />

              <Row
                title="Bedrooms"
                values={compareProperties.map((p) => String(p.bedrooms))}
              />

              <Row
                title="Bathrooms"
                values={compareProperties.map((p) => String(p.bathrooms))}
              />

              <Row
                title="Area"
                values={compareProperties.map((p) => p.area)}
              />

              <Row
                title="Parking"
                values={compareProperties.map((p) => p.parking)}
              />

              <Row
                title="Possession"
                values={compareProperties.map((p) => p.possession)}
              />

              <Row
                title="Rating"
                values={compareProperties.map((p) => `${p.rating}/5 ⭐`)}
              />

            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Row({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  return (
    <tr className="border-b">
      <td className="bg-gray-50 p-4 font-bold">
        {title}
      </td>

      {values.map((value, index) => (
        <td key={index} className="p-4">
          {value}
        </td>
      ))}
    </tr>
  );
}