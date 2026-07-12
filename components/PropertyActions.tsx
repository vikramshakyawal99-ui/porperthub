"use client";

import { useState } from "react";

type Props = {
  propertyId: number;
};

export default function PropertyActions({ propertyId }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [compare, setCompare] = useState(false);

  function addToWishlist() {
    const wishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    if (!wishlist.includes(propertyId)) {
      wishlist.push(propertyId);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );
    }

    setFavorite(true);
  }

  function addToCompare() {
    const compareList = JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    );

    if (!compareList.includes(propertyId)) {
      compareList.push(propertyId);

      localStorage.setItem(
        "compareProperties",
        JSON.stringify(compareList)
      );
    }

    setCompare(true);
  }

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        📞 Contact Builder
      </button>

      <button
        onClick={addToWishlist}
        className={`rounded-xl px-6 py-3 font-semibold ${
          favorite
            ? "bg-red-600 text-white"
            : "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        }`}
      >
        {favorite ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
      </button>

      <button
        onClick={addToCompare}
        className={`rounded-xl px-6 py-3 font-semibold ${
          compare
            ? "bg-green-600 text-white"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {compare ? "✅ Added to Compare" : "⚖️ Compare Property"}
      </button>
    </div>
  );
}