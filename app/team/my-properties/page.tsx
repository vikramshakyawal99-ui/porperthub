"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import TeamGuard from "@/components/team/TeamGuard";

function MyPropertiesContent({
  user,
}: {
  user: any;
}) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const q = query(
          collection(db, "properties"),
          where("addedByUid", "==", user.uid)
        );

        const snap = await getDocs(q);

        setProperties(
          snap.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      } catch (error) {
        console.error("TEAM PROPERTIES ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [user]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <a
          href="/team/dashboard"
          className="text-sm font-black text-green-700"
        >
          ← Team Dashboard
        </a>

        <h1 className="mt-5 text-3xl font-black text-slate-950">
          🏠 My Properties
        </h1>

        <p className="mt-2 text-slate-500">
          Properties added through your Team account.
        </p>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-6">
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-6">
            No properties added yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {properties.map((property) => (
              <article
                key={property.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="font-black text-slate-950">
                  {property.title ||
                    property.projectName ||
                    "Property"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {property.location || "No location"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      property.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {property.status || "pending"}
                  </span>

                  <a
                    href={`/properties/${property.id}`}
                    className="text-sm font-black text-green-700"
                  >
                    View →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function TeamMyPropertiesPage() {
  return (
    <TeamGuard>
      {({ user }) => (
        <MyPropertiesContent user={user} />
      )}
    </TeamGuard>
  );
}
