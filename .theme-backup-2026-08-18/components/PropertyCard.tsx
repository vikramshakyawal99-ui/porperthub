"use client";

import Image from "next/image";
import Link from "next/link";
import { optimizeImage } from "@/lib/image";

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
          className="
            absolute right-4 top-4
            h-10 w-10
            rounded-full
            border border-white/20
            bg-[#080c15]/80
            text-xl
            text-white
            shadow-xl
            backdrop-blur
            transition
            hover:border-[#d4a855]
            hover:text-[#d4a855]
          "
        >
          ♡
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

          {property.area && (
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
