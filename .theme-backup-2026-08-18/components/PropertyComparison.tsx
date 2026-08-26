"use client";

import { useState } from "react";
import { properties } from "../data/properties";

export default function PropertyComparison() {
  const [selected, setSelected] = useState<number[]>([]);

  function toggleProperty(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  }

  const compareProperties = properties.filter((p) =>
    selected.includes(p.id)
  );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 text-center">

          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold text-green-700">
            Smart Comparison
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Compare Properties With Confidence
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Compare important property details side by side and choose the
            one that fits your needs best.
          </p>

          <p className="mt-3 text-sm font-semibold text-green-700">
            Select up to 2 properties to compare
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {properties.map((property) => {
            const isSelected = selected.includes(property.id);

            return (
              <button
                key={property.id}
                onClick={() => toggleProperty(property.id)}
                className={`
                  rounded-3xl
                  border
                  p-6
                  text-left
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  ${
                    isSelected
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-slate-200 bg-white shadow-sm hover:border-green-300 hover:shadow-md"
                  }
                `}
              >

                <div className="flex items-start justify-between gap-3">

                  <h3 className="text-xl font-black text-slate-900">
                    {property.title}
                  </h3>

                  <span
                    className={`
                      flex h-7 w-7 shrink-0 items-center justify-center
                      rounded-full border text-sm
                      ${
                        isSelected
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-slate-300 bg-slate-50 text-transparent"
                      }
                    `}
                  >
                    ✓
                  </span>

                </div>

                <p className="mt-4 text-sm text-slate-500">
                  📍 {property.location}
                </p>

                <p className="mt-4 text-xl font-black text-green-700">
                  ₹ {property.price}
                </p>

              </button>
            );
          })}

        </div>

        {compareProperties.length === 2 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">

            {compareProperties.map((p) => (
              <div
                key={p.id}
                className="
                  rounded-3xl
                  border border-green-100
                  bg-green-50
                  p-8
                  shadow-sm
                "
              >

                <div className="flex items-center justify-between gap-4">

                  <h3 className="text-2xl font-black text-slate-900">
                    {p.title}
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    Compared
                  </span>

                </div>

                <div className="my-6 h-px bg-green-200" />

                <div className="space-y-4 text-slate-600">

                  <p>
                    🏢 <b className="text-slate-900">Builder:</b>{" "}
                    {p.builder}
                  </p>

                  <p>
                    🛏 <b className="text-slate-900">Bedrooms:</b>{" "}
                    {p.bedrooms}
                  </p>

                  <p>
                    📐 <b className="text-slate-900">Area:</b>{" "}
                    {p.area}
                  </p>

                  <p>
                    ⭐ <b className="text-slate-900">Rating:</b>{" "}
                    {p.rating}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}
