"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [builder, setBuilder] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Apartment");

  async function addProperty(e: React.FormEvent) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "properties"), {
        title,
        location,
        builder,
        price,
        type,
        createdAt: new Date(),
      });

      alert("✅ Property Added Successfully!");

      setTitle("");
      setLocation("");
      setBuilder("");
      setPrice("");
      setType("Apartment");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding property");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        🏠 PropertyHub Admin Panel
      </h1>

      <form
        onSubmit={addProperty}
        className="grid gap-5 rounded-2xl bg-white p-8 shadow-xl"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Property Title"
          className="border rounded-xl p-4"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded-xl p-4"
        />

        <input
          value={builder}
          onChange={(e) => setBuilder(e.target.value)}
          placeholder="Builder"
          className="border rounded-xl p-4"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border rounded-xl p-4"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-xl p-4"
        >
          <option>Apartment</option>
          <option>Villa</option>
          <option>Flat</option>
          <option>Penthouse</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 p-4 font-bold text-white"
        >
          ➕ Add Property
        </button>
      </form>
    </main>
  );
}
