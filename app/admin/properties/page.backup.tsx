"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ManageProperties() {
  const [properties, setProperties] = useState<any[]>([]);

  async function loadProperties() {
    const snapshot = await getDocs(collection(db, "properties"));

    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

    setProperties(data);
  }

  async function removeProperty(id: string) {
    if (!confirm("Delete this property?")) return;

    await deleteDoc(doc(db, "properties", id));
    loadProperties();
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 p-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-4xl font-bold">
          Manage Properties
        </h1>

        <div className="space-y-4">

          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between rounded-2xl bg-zinc-900 p-5 shadow"
            >
              <div className="flex gap-4">

                {property.image && (
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-24 w-32 rounded-xl object-cover"
                  />
                )}

                <div>
                  <h2 className="text-xl font-bold">
                    {property.title}
                  </h2>

                  <p>{property.location}</p>

                  <p className="font-semibold text-blue-600">
                    {property.price}
                  </p>

                  <p>
                    Builder: {property.builder}
                  </p>

                  <p>
                    Type: {property.propertyType}
                  </p>

                  <p>
                    Project: {property.projectName}
                  </p>

                  <p>
                    RERA: {property.reraNumber}
                  </p>
                </div>

              </div>

              <div className="flex gap-3">

                <Link
                  href={`/admin/edit-property/${property.id}`}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => removeProperty(property.id)}
                  className="rounded-lg bg-red-600 px-5 py-2 text-white"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
