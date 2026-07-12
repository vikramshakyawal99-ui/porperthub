"use client";

import { useEffect, useState } from "react";

type Props = {
  propertyId: number;
};

export default function PropertyActions({ propertyId }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]") as number[];
    const compareList = JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    ) as number[];

    setFavorite(wishlist.includes(propertyId));
    setCompare(compareList.includes(propertyId));
  }, [propertyId]);

  function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]") as number[];

    if (wishlist.includes(propertyId)) {
      const updated = wishlist.filter((id) => id !== propertyId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setFavorite(false);
    } else {
      wishlist.push(propertyId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setFavorite(true);
    }
  }

  function toggleCompare() {
    const compareList = JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    ) as number[];

    if (compareList.includes(propertyId)) {
      const updated = compareList.filter((id) => id !== propertyId);
      localStorage.setItem("compareProperties", JSON.stringify(updated));
      setCompare(false);
      return;
    }

    if (compareList.length >= 3) {
      alert("You can compare up to 3 properties only.");
      return;
    }

    compareList.push(propertyId);
    localStorage.setItem(
      "compareProperties",
      JSON.stringify(compareList)
    );
    setCompare(true);
  }

  async function shareProperty() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: "PropertyHub",
        text: "Check out this property",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Property link copied to clipboard!");
    }
  }

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        📞 Contact Builder
      </button>

      <button
        onClick={toggleWishlist}
        className={`rounded-xl px-6 py-3 font-semibold transition ${
          favorite
            ? "bg-red-600 text-white"
            : "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        }`}
      >
        {favorite ? "❤️ Remove Wishlist" : "🤍 Add Wishlist"}
      </button>

      <button
        onClick={toggleCompare}
        className={`rounded-xl px-6 py-3 font-semibold transition ${
          compare
            ? "bg-green-600 text-white"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {compare ? "✅ Remove Compare" : "⚖️ Add Compare"}
      </button>

      <button
        onClick={shareProperty}
        className="rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-black"
      >
        📤 Share
      </button>
    </div>
  );
}