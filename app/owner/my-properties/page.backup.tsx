"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
};

export default function MyPropertiesPage() {
  const { user } = useAuth();

  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      if (!user) return;

      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Property, "id">),
      }));

      setProperties(data);
    }

    loadProperties();
  }, [user]);

  async function handleDelete(id: string) {
    const ok = confirm("Delete this property?");

    if (!ok) return;

    await deleteDoc(doc(db, "properties", id));

    setProperties((prev) =>
      prev.filter((property) => property.id !== id)
    );

    alert("Property deleted successfully.");
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">
        My Properties
      </h1>

      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border p-5 shadow"
            >
              <h2 className="text-xl font-bold">
                {property.title}
              </h2>

              <p>📍 {property.location}</p>

              <p>💰 {property.price}</p>

              <div className="mt-4 flex gap-3">
                <button
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
