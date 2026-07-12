"use client";

import { useState } from "react";

type Props = {
  propertyId: number;
};

export default function CompareButton({ propertyId }: Props) {
  const [added, setAdded] = useState(false);

  function handleCompare() {
    const existing = JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    );

    if (!existing.includes(propertyId)) {
      existing.push(propertyId);
      localStorage.setItem(
        "compareProperties",
        JSON.stringify(existing)
      );
    }

    setAdded(true);
  }

  return (
    <button
      onClick={handleCompare}
      className={`rounded-xl px-6 py-3 font-semibold transition ${
        added
          ? "bg-green-600 text-white"
          : "bg-purple-600 text-white hover:bg-purple-700"
      }`}
    >
      {added ? "✅ Added to Compare" : "⚖️ Compare Property"}
    </button>
  );
}