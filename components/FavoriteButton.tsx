"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { addFavorite, removeFavorite } from "@/lib/favorites";

type Props = {
  propertyId: string;
};

export default function FavoriteButton({ propertyId }: Props) {
  const [saved, setSaved] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  async function toggleFavorite() {
    if (!user) {
      const returnPath = `/properties/${propertyId}`;

      router.push(
        `/buyer-login?redirect=${encodeURIComponent(
          returnPath
        )}`
      );

      return;
    }

    try {
      if (saved) {
        await removeFavorite(user.uid, propertyId);
        setSaved(false);
      } else {
        await addFavorite(user.uid, propertyId);
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
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
