"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function DealerSiteVisits() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchVisits() {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "siteVisits"),
        where("dealerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      data.sort((a: any, b: any) => {
        const aDate = `${a.date || ""} ${a.time || ""}`;
        const bDate = `${b.date || ""} ${b.time || ""}`;
        return aDate.localeCompare(bDate);
      });

      setVisits(data);
    } catch (error) {
      console.error("Dealer site visits error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisits();
  }, []);

  async function changeStatus(id: string, status: string) {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Login required");
        return;
      }

      const visitsQuery = query(
        collection(db, "siteVisits"),
        where("dealerId", "==", user.uid)
      );

      const visitsSnap = await getDocs(visitsQuery);

      const ownsVisit = visitsSnap.docs.some(
        (visit) => visit.id === id
      );

      if (!ownsVisit) {
        alert("Access denied");
        return;
      }

      await updateDoc(doc(db, "siteVisits", id), {
        status,
      });

      await fetchVisits();
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Status update failed");
    }
  }

  const totalVisits = visits.length;

  const upcomingVisits = visits.filter(
    (visit) =>
      visit.status !== "Completed" &&
      visit.status !== "Cancelled"
  ).length;

  const completedVisits = visits.filter(
    (visit) => visit.status === "Completed"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            Loading site visits...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3B82F6]">
            Site Visits
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer property visit schedules
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Total Visits
            </p>

            <p className="text-4xl font-bold text-[#3B82F6] mt-3">
              {totalVisits}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Upcoming
            </p>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {upcomingVisits}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Completed
            </p>

            <p className="text-4xl font-bold text-gray-700 mt-3">
              {completedVisits}
            </p>
          </div>

        </div>

        <div className="mt-8 space-y-5">

          {visits.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <div className="text-5xl">
                📅
              </div>

              <h2 className="text-xl font-bold mt-4">
                No Site Visits Scheduled
              </h2>

              <p className="text-gray-500 mt-2">
                Customer bookings will appear here.
              </p>

            </div>

          ) : (

            visits.map((visit) => (

              <div
                key={visit.id}
                className="bg-white rounded-2xl shadow p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      {visit.propertyTitle || "Property Visit"}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      👤 {visit.name || "Customer"}
                    </p>

                    <p className="text-gray-500 mt-1">
                      📞 {visit.phone || "No phone"}
                    </p>

                    <p className="text-gray-500 mt-1">
                      📅 {visit.date || "Date not specified"}
                      {visit.time ? ` • ${visit.time}` : ""}
                    </p>

                    {visit.message && (
                      <p className="text-gray-500 mt-2">
                        💬 {visit.message}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        visit.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : visit.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-[#d4a855]/10 text-[#d4a855]"
                      }`}
                    >
                      {visit.status || "Pending"}
                    </span>

                    <div className="flex flex-wrap gap-2">

                      {visit.phone && (
                        <a
                          href={`tel:${visit.phone}`}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                        >
                          Call
                        </a>
                      )}

                      {visit.phone && (
                        <a
                          href={`https://wa.me/91${String(visit.phone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold"
                        >
                          WhatsApp
                        </a>
                      )}

                      {visit.status !== "Completed" && (
                        <button
                          onClick={() =>
                            changeStatus(visit.id, "Completed")
                          }
                          className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-semibold"
                        >
                          Mark Completed
                        </button>
                      )}

                      {visit.status !== "Cancelled" && (
                        <button
                          onClick={() =>
                            changeStatus(visit.id, "Cancelled")
                          }
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
    </div>
  );
}
