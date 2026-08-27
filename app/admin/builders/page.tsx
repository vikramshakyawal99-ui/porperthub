"use client";

import { useMemo } from "react";
import Link from "next/link";

import useProperties from "@/hooks/useProperties";

export default function AdminBuildersPage() {
  const { properties, loading } = useProperties();

  const builders = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        properties: any[];
      }
    >();

    properties.forEach((property: any) => {
      const name = String(
        property.builder || ""
      ).trim();

      if (!name) return;

      const key = name.toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          name,
          properties: [],
        });
      }

      map.get(key)?.properties.push(property);
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );
  }, [properties]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        Loading builders...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
            PropertyHub Admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Builders
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Builders found in PropertyHub listings.
          </p>
        </div>

        {builders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            No builders found.
          </div>
        ) : (
          <div className="space-y-5">

            {builders.map((builder) => (
              <section
                key={builder.name.toLowerCase()}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      {builder.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {builder.properties.length} properties
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  {builder.properties.map((property: any) => (
                    <div
                      key={property.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-black text-slate-900">
                        {property.title || "Property"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {property.projectName || "No project name"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {property.location || "No location"}
                      </p>

                      <div className="mt-3 flex gap-3">

                        <Link
                          href={`/admin/edit-property/${property.id}`}
                          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white"
                        >
                          Edit Property
                        </Link>

                        <Link
                          href={`/properties/${property.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700"
                        >
                          View
                        </Link>

                      </div>
                    </div>
                  ))}

                </div>

              </section>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}
