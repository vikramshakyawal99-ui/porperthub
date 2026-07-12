"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { properties } from "../../data/properties";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const ids = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    ) as number[];

    setWishlistIds(ids);
  }, []);

  const wishlistProperties = properties.filter((property) =>
    wishlistIds.includes(property.id)
  );

  if (wishlistProperties.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            ❤️ Your Wishlist is Empty
          </h1>

          <p className="mt-4 text-gray-600">
            Save your favorite properties to see them here.
          </p>

          <Link
            href="/properties"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-8 text-4xl font-bold">
          ❤️ My Wishlist
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {wishlistProperties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg"
            >
              <img
                src={property.image}
                alt={property.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-bold">
                  {property.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  📍 {property.location}
                </p>

                <p className="mt-3 text-2xl font-bold text-blue-600">
                  {property.price}
                </p>

                <Link
                  href={`/properties/${property.id}`}
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}