"use client";

import { useState } from "react";
import { properties } from "../data/properties";

export default function PropertyComparison() {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleProperty(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      if (selected.length < 2) {
        setSelected([...selected, id]);
      }
    }
  }

  const compareProperties = properties.filter((p) =>
    selected.includes(p.id)
  );

  return (
    <section className="mt-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
    <div className="mx-auto max-w-7xl px-6">

      <div className="mb-12 text-center">
        <p className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
          Smart Comparison
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
          ⚖️ Compare Properties
        </h2>

        <p className="mt-4 text-slate-600">
          Compare price, location and features before making your decision.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">

        {properties.map((property) => (
          <button
            key={property.id}
            onClick={() => toggleProperty(property.id)}
            className={`rounded-3xl border p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              selected.includes(property.id)
                ? "border-blue-600 bg-blue-50"
                : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-xl font-bold">
              {property.title}
            </h3>

            <p>
              📍 {property.location}
            </p>

            <p>
              💰 {property.price}
            </p>

          </button>
        ))}

      </div>


      {compareProperties.length === 2 && (

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          {compareProperties.map((p) => (

            <div
              key={p.id}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            >

              <h3 className="text-2xl font-bold">
                {p.title}
              </h3>

              <hr className="my-4"/>

              <div className="mt-5 space-y-3 text-slate-700">

              <p>🏢 <b>Builder:</b> {p.builder}</p>

              <p>🛏 <b>Bedrooms:</b> {p.bedrooms}</p>

              <p>📐 <b>Area:</b> {p.area}</p>

              <p>⭐ <b>Rating:</b> {p.rating}</p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
    </section>
  );
}
