"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function DealerListings() {

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProperties() {

    try {

      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "properties"),
        where("dealerId", "==", user.uid)
      );

      const snap = await getDocs(q);

      setProperties(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

    } catch (e) {

      console.log(e);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function removeProperty(id: string) {

    if (!confirm("Delete this property?")) return;

    try {

      await deleteDoc(doc(db, "properties", id));
      fetchProperties();

    } catch (e) {

      console.log(e);
      alert("Delete failed");

    }

  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-[#3B82F6]">
              My Properties
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your uploaded properties
            </p>
          </div>

          <Link
            href="/dealer/add-property"
            className="bg-[#3B82F6] text-white px-5 py-3 rounded-xl"
          >
            + Add Property
          </Link>

        </div>

        {loading ? (

          <div className="text-center py-20 text-xl">
            Loading...
          </div>

        ) : properties.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-6xl">🏠</div>

            <h2 className="text-2xl font-bold mt-5">
              No Properties Found
            </h2>

            <p className="text-gray-500 mt-2">
              Add your first property.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {properties.map((property: any) => (

              <div
                key={property.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >

                <img
                  src={property.image || "/hero-property.jpg"}
                  alt={property.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h2 className="text-xl font-bold">
                    {property.title}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    📍 {property.location}
                  </p>

                  <p className="text-[#3B82F6] font-bold mt-3">
                    ₹ {property.price}
                  </p>

                  <div className="mt-2 text-sm text-gray-500">
                    {property.propertyType}

                    <div className="mt-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          property.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : property.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-[#d4a855]/10 text-[#d4a855]"
                        }`}
                      >
                        {property.status === "approved"
                          ? "Approved"
                          : property.status === "rejected"
                          ? "Rejected"
                          : "Pending Review"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 text-center bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
                    >
                      View
                    </Link>

                    <Link
                      href={`/dealer/edit-property/${property.id}`}
                      className="flex-1 text-center bg-[#3B82F6] text-white py-2 rounded-lg hover:bg-[#60A5FA]"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => removeProperty(property.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}
