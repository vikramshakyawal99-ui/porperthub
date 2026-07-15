"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditProperty() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    async function loadProperty() {
      const ref = doc(db, "properties", id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "");
        setLocation(data.location || "");
        setPrice(data.price || "");
      }
    }

    if (id) loadProperty();
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    await updateDoc(doc(db, "properties", id as string), {
      title,
      location,
      price,
    });

    alert("✅ Property Updated Successfully");
    router.push("/admin/properties");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-6 text-3xl font-bold">
          Edit Property
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">

          <input
            className="w-full rounded-xl border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <input
            className="w-full rounded-xl border p-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />

          <input
            className="w-full rounded-xl border p-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 p-3 text-white"
          >
            Update Property
          </button>

        </form>

      </div>
    </main>
  );
}
