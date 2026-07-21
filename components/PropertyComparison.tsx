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
    <section className="mx-auto mt-20 max-w-7xl px-6">

      <h2 className="mb-10 text-center text-4xl font-bold">
        ⚖️ Compare Properties
      </h2>

      <div className="grid gap-6 md:grid-cols-4">

        {properties.map((property) => (
          <button
            key={property.id}
            onClick={() => toggleProperty(property.id)}
            className={`rounded-2xl border p-5 text-left shadow transition ${
              selected.includes(property.id)
                ? "border-blue-600 bg-blue-50"
                : "bg-zinc-900"
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
              className="rounded-3xl bg-zinc-900 p-8 shadow-xl"
            >

              <h3 className="text-2xl font-bold">
                {p.title}
              </h3>

              <hr className="my-4"/>

              <p>🏢 Builder: {p.builder}</p>

              <p>🛏 Bedrooms: {p.bedrooms}</p>

              <p>📐 Area: {p.area}</p>

              <p>⭐ Rating: {p.rating}</p>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}
