"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { properties } from "../../data/properties";
import Navbar from "../../components/Navbar";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const ids = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    ) as number[];

    setWishlistIds(ids);
  }, []);

  function removeFromWishlist(id: number) {
    const updated = wishlistIds.filter(
      (propertyId) => propertyId !== id
    );

    setWishlistIds(updated);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated)
    );
  }

  const wishlistProperties = properties.filter((property) =>
    wishlistIds.includes(property.id)
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-zinc-950 py-10">
        <div className="mx-auto max-w-7xl px-6">

          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            ❤️ My Wishlist
          </h1>

          {wishlistProperties.length === 0 ? (
            <div className="rounded-3xl bg-zinc-900 p-10 text-center shadow">
              <h2 className="text-3xl font-bold">
                Wishlist Empty
              </h2>

              <p className="mt-4 text-gray-300">
                Save your favourite properties and view them here.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
              >
                Explore Properties
              </Link>
            </div>
          ) : (

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {wishlistProperties.map((property) => (

                <div
                  key={property.id}
                  className="overflow-hidden rounded-3xl bg-zinc-900 shadow-lg"
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

                    <p className="mt-2 text-gray-300">
                      📍 {property.location}
                    </p>

                    <p className="mt-3 text-2xl font-bold text-blue-600">
                      {property.price}
                    </p>


                    <div className="mt-6 flex gap-3">

                      <Link
                        href={`/properties/${property.id}`}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
                      >
                        View
                      </Link>


                      <button
                        onClick={() => removeFromWishlist(property.id)}
                        className="rounded-xl border border-red-500 px-5 py-3 font-semibold text-red-500"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </main>
    </>
  );
}
