"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Property = {
  id: string;
  title?: string;
  location?: string;
  rent?: string;
  image?: string;
  status?: string;
  propertyType?: string;
  gender?: string;
  sharingType?: string;
  food?: string;
};

export default function MyPGPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      if (!user) return;

      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", user.uid),
        where("propertyType", "==", "pg")
      );

      const snap = await getDocs(q);

      setProperties(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Property[]
      );
    }

    loadProperties();
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this PG?")) return;

    await deleteDoc(doc(db, "properties", id));

    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">My PG</h1>

      {properties.length === 0 ? (
        <p>No PG Found</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border p-5 shadow"
            >
              {property.image && (
                <Image
src={property.image}
alt={property.title || "Property"}
width={600}
height={400}
className="mb-4 h-48 w-full rounded-xl object-cover"
/>
              )}

              <h2 className="text-xl font-bold">{property.title}</h2>

              <p>📍 {property.location}</p>
              <p>💰 ₹{property.rent}/month</p>
              <p>👤 {property.gender}</p>
              <p>🛏 {property.sharingType} Sharing</p>
              <p>🍽 Food : {property.food}</p>

              <div className="mt-3">
                {property.status === "approved" ? (
                  <span className="rounded bg-green-600 px-3 py-1 text-white">
                    Approved
                  </span>
                ) : property.status === "rejected" ? (
                  <span className="rounded bg-red-600 px-3 py-1 text-white">
                    Rejected
                  </span>
                ) : (
                  <span className="rounded bg-[#d4a855] px-3 py-1 text-black">
                    Pending
                  </span>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="rounded bg-[#60A5FA] px-4 py-2 text-white"
                  onClick={() =>
                    router.push(`/owner/edit-property/${property.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="rounded bg-red-600 px-4 py-2 text-white"
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
