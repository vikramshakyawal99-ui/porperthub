"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AddPropertyPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = "";

      if (image) {
        const imageRef = ref(
          storage,
          `properties/${Date.now()}-${image.name}`
        );

        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "properties"), {
        title,
        location,
        price,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("✅ Property Added Successfully!");

      setTitle("");
      setLocation("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error adding property");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold">
          Add Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-3 text-white"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>

        </form>
      </div>
    </main>
  );
}
