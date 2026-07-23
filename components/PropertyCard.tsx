"use client";

import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string | number;
  title: string;
  location: string;
  price: string;
  image?: string;
  builder?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  area?: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

      <div className="relative h-64">

        <Image
          src={property.image || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover"
        />

      </div>

      <div className="p-5">

        <h3 className="text-xl font-semibold">
          {property.title}
        </h3>

        <p className="text-gray-500 mt-2">
          {property.location}
        </p>

        <p className="text-blue-600 font-bold mt-3">
          {property.price}
        </p>

        <div className="flex gap-4 text-sm text-gray-600 mt-3">

          {property.bedrooms && (
            <span>
              {property.bedrooms} Beds
            </span>
          )}

          {property.bathrooms && (
            <span>
              {property.bathrooms} Baths
            </span>
          )}

          {property.area && (
            <span>
              {property.area}
            </span>
          )}

        </div>


        <Link
          href={`/properties/${property.id}`}
          className="block mt-5 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          View Details
        </Link>


      </div>

    </div>
  );
}
