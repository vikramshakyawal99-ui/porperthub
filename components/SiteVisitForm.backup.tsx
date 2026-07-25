"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Props {
  propertyId: string;
  propertyTitle: string;
}

export default function SiteVisitForm({
  propertyId,
  propertyTitle,
}: Props) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await addDoc(collection(db, "siteVisits"), {
        name,
        phone,
        date,
        time,
        message,
        propertyId,
        propertyTitle,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("Site Visit Booked Successfully ✅");

      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setMessage("");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="mt-10 rounded-3xl bg-zinc-900 p-8 shadow-xl border">

      <h2 className="mb-2 text-3xl font-bold">
        📅 Book a Site Visit
      </h2>

      <p className="mb-8 text-gray-300">
        Fill the form and our property expert will contact you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
          className="w-full rounded-xl border p-4"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          required
          className="w-full rounded-xl border p-4"
        />

        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          required
          className="w-full rounded-xl border p-4"
        />

        <select
          value={time}
          onChange={(e)=>setTime(e.target.value)}
          required
          className="w-full rounded-xl border p-4"
        >
          <option value="">Select Time</option>
          <option>Morning (9 AM - 12 PM)</option>
          <option>Afternoon (12 PM - 4 PM)</option>
          <option>Evening (4 PM - 7 PM)</option>
        </select>

        <textarea
          placeholder="Message (Optional)"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          className="w-full rounded-xl border p-4"
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white"
        >
          {loading ? "Booking..." : "Book Free Visit"}
        </button>

      </form>

    </div>
  );
}
