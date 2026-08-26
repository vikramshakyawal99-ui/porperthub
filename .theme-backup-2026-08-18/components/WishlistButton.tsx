"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  addWishlist,
  removeWishlist,
} from "@/lib/wishlist";

type Props = {
  propertyId: string;
};

export default function WishlistButton({
  propertyId,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [saved, setSaved] = useState(false);

  async function toggleWishlist() {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (saved) {
        await removeWishlist(user.uid, propertyId);
        setSaved(false);
      } else {
        await addWishlist(user.uid, propertyId);
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`rounded-xl px-8 py-4 font-bold transition ${
        saved
          ? "bg-pink-600 text-white"
          : "border-2 border-pink-600 text-pink-600"
      }`}
    >
      {saved ? "💖 Wishlisted" : "🤍 Add to Wishlist"}
    </button>
  );
}
