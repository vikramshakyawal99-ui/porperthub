"use client";

import { useState } from "react";

type Props = {
  propertyId: number;
};


export default function FavoriteButton({
  propertyId,
}: Props) {

  const [saved, setSaved] = useState(false);


  function toggleFavorite() {

    const favorites =
      JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );


    if (favorites.includes(propertyId)) {

      const updated =
        favorites.filter(
          (id:number)=> id !== propertyId
        );

      localStorage.setItem(
        "favorites",
        JSON.stringify(updated)
      );

      setSaved(false);

    } else {

      favorites.push(propertyId);

      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
      );

      setSaved(true);

    }

  }


  return (

    <button
      onClick={toggleFavorite}
      className={`rounded-xl px-8 py-4 font-bold transition ${
        saved
        ? "bg-red-500 text-white"
        : "border-2 border-red-500 text-red-500"
      }`}
    >

      {saved ? "❤️ Saved" : "♡ Add to Favorites"}

    </button>

  );

}
