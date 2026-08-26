"use client";

import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export default function FavoritesPage() {
  const { user, loading } = useAuth();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setPageLoading(false);
        return;
      }

      try {
        const favSnap = await getDocs(
          collection(db, "users", user.uid, "favorites")
        );

        const list = [];

        for (const fav of favSnap.docs) {
          const propertySnap = await getDoc(
            doc(db, "properties", fav.id)
          );

          if (propertySnap.exists()) {
            list.push({
              id: propertySnap.id,
              ...propertySnap.data(),
            });
          }
        }

        setFavorites(list);
      } catch (e) {
        console.error(e);
      }

      setPageLoading(false);
    }

    load();
  }, [user]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Please Login</h1>

        <Link
          href="/login"
          className="bg-green-600 text-slate-900 px-6 py-3 rounded-xl"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-10">
      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Favorite Properties
      </h1>

      {favorites.length === 0 ? (
        <p>No favorite properties.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl overflow-hidden"
            >
              <Image
src={property.image}
alt={property.title}
width={600}
height={400}
className="h-56 w-full object-cover"
/>

              <div className="p-5">
                <h2 className="text-xl font-bold">
                  {property.title}
                </h2>

                <p>{property.location}</p>

                <p className="text-[#93C5FD] font-bold">
                  {property.price}
                </p>

                <Link
                  href={`/properties/${property.id}`}
                  className="inline-block mt-4 bg-green-600 px-5 py-2 rounded-lg"
                >
                  View Property
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
