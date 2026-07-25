"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Property = {
  id: string;
  title?: string;
  image?: string;
  location?: string;
  price?: string;
  builder?: string;
  propertyType?: string;
  projectName?: string;
  reraNumber?: string;
  status?: "pending" | "approved" | "rejected";
};

export default function ManageProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  async function loadProperties() {
    const snapshot = await getDocs(collection(db, "properties"));

    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Property, "id">),
    }));

    setProperties(data);
  }

  async function removeProperty(id: string) {
    if (!confirm("Delete this property?")) return;

    await deleteDoc(doc(db, "properties", id));
    loadProperties();
  }

  async function updatePropertyStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    await updateDoc(doc(db, "properties", id), {
      status,
    });

    loadProperties();
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Manage Properties
        </h1>

        <div className="space-y-5">

          {properties.map((property) => (

            <div
              key={property.id}
              className="rounded-2xl bg-zinc-900 p-5 shadow"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex gap-5">

                  {property.image && (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-28 w-40 rounded-xl object-cover"
                    />
                  )}

                  <div>

                    <h2 className="text-2xl font-bold text-white">
                      {property.title}
                    </h2>

                    <p className="text-gray-300">
                      📍 {property.location}
                    </p>

                    <p className="mt-1 font-semibold text-blue-400">
                      ₹ {property.price}
                    </p>

                    <p className="text-gray-300">
                      Builder: {property.builder}
                    </p>

                    <p className="text-gray-300">
                      Type: {property.propertyType}
                    </p>

                    <p className="text-gray-300">
                      Project: {property.projectName}
                    </p>

                    <p className="text-gray-300">
                      RERA: {property.reraNumber}
                    </p>

                    <div className="mt-3">

                      {property.status === "approved" ? (
                        <span className="rounded bg-green-600 px-3 py-1 text-white">
                          ✅ Approved
                        </span>
                      ) : property.status === "rejected" ? (
                        <span className="rounded bg-red-600 px-3 py-1 text-white">
                          ❌ Rejected
                        </span>
                      ) : (
                        <span className="rounded bg-yellow-500 px-3 py-1 text-black">
                          ⏳ Pending
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      updatePropertyStatus(property.id, "approved")
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updatePropertyStatus(property.id, "rejected")
                    }
                    className="rounded-lg bg-yellow-600 px-4 py-2 text-white"
                  >
                    Reject
                  </button>

                  <Link
                    href={`/admin/edit-property/${property.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => removeProperty(property.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
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
