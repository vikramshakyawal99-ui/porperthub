"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

import { optimizeImage } from "@/lib/image";
import { db } from "@/lib/firebase";
import { addFavorite, removeFavorite } from "@/lib/favorites";
import { useAuth } from "@/components/AuthProvider";

interface Property {
  id: string | number;

  title?: string;
  location?: string;

  price?: string | number;
  rent?: string | number;

  image?: string;
  images?: string[];

  bedrooms?: string | number;
  bathrooms?: string | number;

  area?: string;

  propertyType?: string;

  ac?: string;
  food?: string;

  suitableFor?: string;
  gender?: string;

  sharingType?: string;
  roomType?: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const propertyId = String(property.id);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadFavorite() {
      if (!user) {
        if (active) {
          setSaved(false);
        }
        return;
      }

      try {
        const favoriteRef = doc(
          db,
          "users",
          user.uid,
          "favorites",
          propertyId
        );

        const snapshot = await getDoc(favoriteRef);

        if (active) {
          setSaved(snapshot.exists());
        }
      } catch (error) {
        console.error(
          "LOAD FAVORITE ERROR:",
          error
        );
      }
    }

    loadFavorite();

    return () => {
      active = false;
    };
  }, [user, propertyId]);

  async function toggleFavorite(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      router.push(
        `/buyer-login?redirect=${encodeURIComponent(
          `/properties/${propertyId}`
        )}`
      );
      return;
    }

    if (saving) {
      return;
    }

    const previousSaved = saved;

    setSaving(true);
    setSaved(!previousSaved);

    try {
      if (previousSaved) {
        await removeFavorite(
          user.uid,
          propertyId
        );
      } else {
        await addFavorite(
          user.uid,
          propertyId
        );
      }
    } catch (error) {
      setSaved(previousSaved);

      console.error(
        "TOGGLE FAVORITE ERROR:",
        error
      );

      alert(
        "Unable to update saved property. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const image = optimizeImage(
    property.images?.[0] ||
    property.image ||
    "/placeholder.jpg"
  );

  const isRental =
    property.propertyType === "rent" ||
    property.propertyType === "pg" ||
    property.propertyType === "hostel" ||
    property.propertyType === "room_rent";

  return (
    <div
      className="
        group overflow-hidden rounded-3xl
        border border-white/10
        bg-[#0d1422]
        shadow-[0_15px_45px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:-translate-y-2
        hover:border-[#d4a855]/40
        hover:shadow-[0_20px_55px_rgba(0,0,0,0.5)]
      "
    >

      {/* IMAGE */}

      <div className="relative h-64 overflow-hidden">

        <Image
          src={image}
          alt={property.title || "Property"}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="
            object-cover
            transition duration-700
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080c15]/70 via-transparent to-transparent" />

        <div
          className="
            absolute left-4 top-4
            rounded-full
            border border-[#d4a855]/30
            bg-[#080c15]/80
            px-4 py-1.5
            text-xs font-black
            text-[#d4a855]
            shadow-lg
            backdrop-blur
          "
        >
          ✓ Verified
        </div>

        <button
          type="button"
          aria-label={
            saved
              ? "Remove from saved properties"
              : "Save property"
          }
          title={
            saved
              ? "Remove from saved properties"
              : "Save property"
          }
          disabled={saving}
          onClick={toggleFavorite}
          className={`
            absolute right-4 top-4
            h-10 w-10
            rounded-full
            border
            text-xl
            shadow-xl
            backdrop-blur
            transition
            disabled:cursor-wait
            disabled:opacity-60
            ${
              saved
                ? "border-red-400 bg-red-500 text-white"
                : "border-white/20 bg-[#080c15]/80 text-white hover:border-red-400 hover:text-red-400"
            }
          `}
        >
          {saved ? "♥" : "♡"}
        </button>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <h3
          className="
            line-clamp-1
            text-2xl
            font-black
            tracking-tight
            text-white
          "
        >
          {property.title || "Premium Property"}
        </h3>

        <p className="mt-2 text-sm text-[#aaa49b]">
          📍 {property.location || "Location unavailable"}
        </p>

        <p
          className="
            mt-4
            text-3xl
            font-black
            text-[#d4a855]
          "
        >
          ₹ {isRental
            ? property.rent || "N/A"
            : property.price || "N/A"
          }
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">

          {property.bedrooms && (
            <span
              className="
                rounded-full
                border border-white/10
                bg-white/5
                px-4 py-1.5
                font-semibold
                text-[#d0c7b9]
              "
            >
              🛏 {property.bedrooms} Beds
            </span>
          )}

          {property.bathrooms && (
            <span
              className="
                rounded-full
                border border-white/10
                bg-white/5
                px-4 py-1.5
                font-semibold
                text-[#d0c7b9]
              "
            >
              🚿 {property.bathrooms} Baths
            </span>
          )}

          {property.area && !isRental && (
            <span
              className="
                rounded-full
                border border-white/10
                bg-white/5
                px-4 py-1.5
                font-semibold
                text-[#d0c7b9]
              "
            >
              📐 {property.area}
            </span>
          )}

        </div>

        {isRental && (
          <div className="mt-4 flex flex-wrap gap-2">

            {property.food && (
              <span
                className="
                  rounded-full
                  border border-[#d4a855]/20
                  bg-[#d4a855]/10
                  px-4 py-1.5
                  text-sm font-semibold
                  text-[#d4a855]
                "
              >
                🍛 Food
              </span>
            )}

            {property.sharingType && (
              <span
                className="
                  rounded-full
                  border border-white/10
                  bg-white/5
                  px-4 py-1.5
                  text-sm font-semibold
                  text-[#d0c7b9]
                "
              >
                👥 {property.sharingType}
              </span>
            )}

          </div>
        )}

        <Link
          href={`/properties/${property.id}`}
          className="
            mt-6 block
            rounded-xl
            border border-[#d4a855]
            bg-[#d4a855]
            py-3
            text-center
            font-black
            text-[#080c15]
            shadow-[0_8px_25px_rgba(212,168,85,0.15)]
            transition-all
            hover:bg-[#e0b866]
            hover:shadow-[0_10px_30px_rgba(212,168,85,0.25)]
          "
        >
          View Details →
        </Link>

      </div>

    </div>
  );
}
