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

    <div className="
      group overflow-hidden rounded-3xl
      bg-white shadow-xl
      border border-slate-200
      transition-all duration-300
      hover:-translate-y-2
      hover:shadow-2xl
    ">


      {/* Image */}

      <div className="relative h-64 overflow-hidden">

        <Image
          src={image}
          alt={property.title || "Property"}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="
            object-cover
            transition duration-500
            group-hover:scale-110
          "
        />


        <div className="
          absolute left-4 top-4
          rounded-full
          bg-gradient-to-r from-emerald-500 to-green-600
          px-4 py-1.5
          text-xs font-black
          text-white shadow-lg
        ">
          ✓ Verified
        </div>


        <button
          className="
            absolute right-4 top-4
            h-10 w-10
            rounded-full
            bg-white/95
            text-xl
            shadow-xl backdrop-blur
          "
        >
          ♡
        </button>


      </div>



      {/* Content */}

      <div className="p-5">


        <h3 className="
          text-2xl font-black
          tracking-tight
          text-slate-900
          line-clamp-1
        ">
          {property.title || "Premium Property"}
        </h3>



        <p className="
          mt-2
          text-sm
          text-slate-600
        ">
          📍 {property.location || "Location unavailable"}
        </p>



        <p className="
          mt-4
          text-3xl
          font-black
          text-transparent
          bg-clip-text
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
        ">
          ₹ {isRental
            ? property.rent || "N/A"
            : property.price || "N/A"
          }
        </p>



        <div className="
          mt-4 flex flex-wrap gap-2
          text-sm text-slate-700
        ">


          {property.bedrooms && (
            <span className="rounded-full bg-slate-50 border border-slate-200 px-4 py-1.5 font-semibold">
              🛏 {property.bedrooms} Beds
            </span>
          )}


          {property.bathrooms && (
            <span className="rounded-full bg-slate-50 border border-slate-200 px-4 py-1.5 font-semibold">
              🚿 {property.bathrooms} Baths
            </span>
          )}


          {property.area && (
            <span className="rounded-full bg-slate-50 border border-slate-200 px-4 py-1.5 font-semibold">
              📐 {property.area}
            </span>
          )}


        </div>



        {isRental && (

          <div className="mt-4 flex flex-wrap gap-2">


            {property.food && (
              <span className="rounded-full bg-orange-50 border border-orange-200 px-4 py-1.5 text-sm font-semibold text-orange-700">
                🍛 Food
              </span>
            )}


            {property.sharingType && (
              <span className="rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm font-semibold text-blue-700">
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
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            py-3
            text-center
            font-black
            text-white
            shadow-lg
            transition
            hover:scale-[1.02]
          "
        >
          View Details →
        </Link>


      </div>


    </div>

  );
}
