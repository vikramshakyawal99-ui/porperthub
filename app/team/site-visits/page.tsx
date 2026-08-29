"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import TeamGuard from "@/components/team/TeamGuard";

function TeamSiteVisitsContent({
  user,
}: {
  user: any;
}) {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadVisits() {
    try {
      const q = query(
        collection(db, "siteVisits"),
        where("ownerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      data.sort((a: any, b: any) =>
        `${a.date || ""} ${a.time || ""}`.localeCompare(
          `${b.date || ""} ${b.time || ""}`
        )
      );

      setVisits(data);
    } catch (error) {
      console.error("TEAM SITE VISITS ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVisits();
  }, [user]);

  async function changeStatus(
    id: string,
    status: string
  ) {
    try {
      await updateDoc(
        doc(db, "siteVisits", id),
        { status }
      );

      await loadVisits();
    } catch (error) {
      console.error(error);
      alert("Status update failed");
    }
  }

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
          📅 Site Visits
        </h1>

        <p className="mt-2 text-slate-500">
          Customer visits assigned to you.
        </p>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-6">
            Loading site visits...
          </div>
        ) : visits.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-6">
            No site visits yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {visits.map((visit) => (
              <article
                key={visit.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-4">

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Customer
                    </p>

                    <p className="mt-2 font-black text-slate-950">
                      {visit.name || "Customer"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {visit.phone || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Property
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {visit.propertyTitle || "Property"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      Visit
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {visit.date || "No date"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {visit.time || ""}
                    </p>
                  </div>

                  <div>
                    <select
                      value={visit.status || "Pending"}
                      onChange={(event) =>
                        changeStatus(
                          visit.id,
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 font-bold"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default function TeamSiteVisitsPage() {
  return (
    <TeamGuard>
      {({ user }) => (
        <TeamSiteVisitsContent user={user} />
      )}
    </TeamGuard>
  );
}
