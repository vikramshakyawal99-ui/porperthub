"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SiteVisitsPage() {

  const [visits, setVisits] = useState<any[]>([]);

  async function fetchVisits() {
    const snap = await getDocs(collection(db, "siteVisits"));

    const data = snap.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setVisits(data);
  }


  useEffect(() => {
    fetchVisits();
  }, []);


  async function updateStatus(
    id: string,
    status: string
  ) {
    await updateDoc(
      doc(db, "siteVisits", id),
      {
        status,
      }
    );

    fetchVisits();
  }


  async function deleteVisit(id: string) {

    const confirmDelete = confirm(
      "Delete this site visit request?"
    );

    if (!confirmDelete) return;

    await deleteDoc(
      doc(db, "siteVisits", id)
    );

    fetchVisits();
  }


  return (
    <main className="min-h-screen bg-zinc-950 p-10">

      <h1 className="mb-8 text-4xl font-bold">
        📅 Site Visit Requests
      </h1>


      <div className="space-y-5">

        {visits.length === 0 && (
          <p className="text-gray-300">
            No site visits found
          </p>
        )}


        {visits.map((visit) => (

          <div
            key={visit.id}
            className="rounded-2xl bg-zinc-900 p-6 shadow"
          >

            <h2 className="text-2xl font-bold">
              {visit.propertyTitle}
            </h2>


            <div className="mt-3 space-y-1 text-gray-700">

              <p>
                👤 Name: {visit.name}
              </p>

              <p>
                📞 Phone: {visit.phone}
              </p>

              <p>
                📅 Date: {visit.date}
              </p>

              <p>
                ⏰ Time: {visit.time}
              </p>

              <p>
                📝 Message: {visit.message || "-"}
              </p>

              <div className="mt-3">
                <span className="font-medium">
                  Status:
                </span>

                <span
                  className={`ml-3 rounded-full px-4 py-1 text-sm font-bold ${
                    visit.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : visit.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-[#d4a855]/10 text-[#d4a855]"
                  }`}
                >
                  {visit.status}
                </span>
              </div>

            </div>


            <div className="mt-5 flex flex-wrap gap-3">

              <a
                href={`tel:${visit.phone}`}
                className="rounded-xl bg-[#60A5FA] px-5 py-2 text-white"
              >
                📞 Call Customer
              </a>


              <a
                href={`https://wa.me/91${visit.phone}`}
                target="_blank"
                className="rounded-xl bg-green-500 px-5 py-2 text-white"
              >
                💬 WhatsApp
              </a>


              <button
                onClick={() =>
                  updateStatus(
                    visit.id,
                    "Approved"
                  )
                }
                className="rounded-xl bg-green-600 px-5 py-2 text-white"
              >
                Approve
              </button>


              <button
                onClick={() =>
                  updateStatus(
                    visit.id,
                    "Rejected"
                  )
                }
                className="rounded-xl bg-red-600 px-5 py-2 text-white"
              >
                Reject
              </button>


              <button
                onClick={() =>
                  deleteVisit(visit.id)
                }
                className="rounded-xl bg-gray-800 px-5 py-2 text-white"
              >
                🗑 Delete
              </button>


            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
