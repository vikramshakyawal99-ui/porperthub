"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Property = {
  id: string;
  ownerId?: string;
  title?: string;
  image?: string;
  location?: string;
  price?: string;
  rent?: string;
  builder?: string;
  propertyType?: string;
  suitableFor?: string;
  gender?: string;
  projectName?: string;
  reraNumber?: string;
  status?: "pending" | "approved" | "rejected";
};

export default function ManageProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  async function loadProperties() {
    try {
      console.log("🚀 Loading properties...");

      const snapshot = await getDocs(collection(db, "properties"));

      console.log("✅ Snapshot size:", snapshot.size);

      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Property, "id">),
      }));

      setProperties(data);

    } catch (error) {
      console.error("❌ LOAD PROPERTIES ERROR:", error);
    }
  }

  async function removeProperty(id: string) {
    if (!confirm("Delete this property?")) return;

    await deleteDoc(doc(db, "properties", id));
    loadProperties();
  }

  async function changePropertyStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    try {
      const action = status === "approved" ? "approve" : "reject";

      if (!confirm(`Are you sure you want to ${action} this property?`)) {
        return;
      }

      await updateDoc(doc(db, "properties", id), {
        status,
      });

      await loadProperties();

      alert(
        status === "approved"
          ? "✅ Property approved successfully"
          : "❌ Property rejected"
      );
    } catch (error) {
      console.error("PROPERTY STATUS UPDATE ERROR:", error);
      alert("Failed to update property status");
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-slate-900">
          Manage Properties
        </h1>

        <div className="space-y-5">

          {properties.map((property) => (

            <div
              key={property.id}
              className="rounded-2xl bg-white p-5 shadow"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex gap-5">

                  {property.image && (
                    <Image
                      src={property.image}
                      alt={property.title || "Property"}
                      width={160}
                      height={112}
                      className="h-28 w-40 rounded-xl object-cover"
                    />
                  )}

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      {property.title}
                    </h2>

                    <p className="text-gray-300">
                      📍 {property.location}
                    </p>

                    <p className="mt-1 font-semibold text-[#93C5FD]">
                      ₹ {
                        (
                          property.propertyType==="rent" ||
                          property.propertyType==="room_rent" ||
                          property.propertyType==="pg" ||
                          property.propertyType==="hostel"
                        )
                        ?
                        property.rent
                        :
                        property.price
                      }
                    </p>

                    <p className="text-gray-300">
                      Builder: {property.builder}
                    </p>

                    <p className="text-gray-300">
                      Type: {property.propertyType}
                    </p>


                    {
                    (property.suitableFor || property.gender) && (

                    <p className="text-gray-300">
                      👤 {
                      property.suitableFor==="family"
                      ?
                      "Family Allowed"
                      :
                      property.suitableFor==="boys"
                      ?
                      "Boys"
                      :
                      property.suitableFor==="girls"
                      ?
                      "Girls"
                      :
                      property.suitableFor==="co_living"
                      ?
                      "Co-Living"
                      :
                      property.suitableFor==="anyone"
                      ?
                      "Anyone"
                      :
                      property.suitableFor || property.gender
                      }
                    </p>

                    )
                    }

                    <p className="text-gray-300">
                      Project: {property.projectName}
                    </p>

                    <p className="text-gray-300">
                      RERA: {property.reraNumber}
                    </p>

                    <div className="mt-3">

                      {property.status === "approved" ? (
                        <span className="rounded bg-green-600 px-3 py-1 text-slate-900">
                          ✅ Approved
                        </span>
                      ) : property.status === "rejected" ? (
                        <span className="rounded bg-red-600 px-3 py-1 text-slate-900">
                          ❌ Rejected
                        </span>
                      ) : (
                        <span className="rounded bg-green-600 px-3 py-1 text-slate-900">
                          ⏳ Pending
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  {property.status !== "approved" && (
                    <button
                      onClick={() =>
                        changePropertyStatus(property.id, "approved")
                      }
                      className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
                    >
                      ✅ Approve
                    </button>
                  )}

                  {property.status !== "rejected" && (
                    <button
                      onClick={() =>
                        changePropertyStatus(property.id, "rejected")
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-700"
                    >
                      Reject
                    </button>
                  )}

                  <Link
                    href={`/admin/edit-property/${property.id}`}
                    className="rounded-lg bg-green-600 px-4 py-2 text-slate-900"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => removeProperty(property.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-slate-900"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}
