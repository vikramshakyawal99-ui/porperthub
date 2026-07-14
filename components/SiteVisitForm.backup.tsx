"use client";

import { useState } from "react";

export default function SiteVisitForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    alert(
      `Site Visit Booked!\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}`
    );

    setName("");
    setPhone("");
    setDate("");
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl border">
      <h2 className="mb-2 text-3xl font-bold text-gray-900">
        📅 Book a Site Visit
      </h2>

      <p className="mb-8 text-gray-600">
        Fill the form and our property expert will contact you.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border p-4 outline-none focus:border-blue-600"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-xl border p-4 outline-none focus:border-blue-600"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-xl border p-4 outline-none focus:border-blue-600"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
        >
          Book Free Visit
        </button>
      </form>
    </div>
  );
}