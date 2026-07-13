"use client";

import { useEffect, useState } from "react";
import { properties } from "../../data/properties";
import PropertyCard from "../../components/PropertyCard";


export default function FavoritesPage() {

  const [favorites, setFavorites] = useState<number[]>([]);


  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

    setFavorites(saved);

  }, []);


  const favoriteProperties =
    properties.filter((property) =>
      favorites.includes(property.id)
    );


  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-10 text-4xl font-bold">
          ❤️ My Favorite Properties
        </h1>


        {
          favoriteProperties.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow">

              <h2 className="text-2xl font-bold">
                No Favorites Yet
              </h2>

              <p className="mt-3 text-gray-600">
                Save properties to see them here.
              </p>

            </div>

          ) : (

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

              {favoriteProperties.map((property)=>(

                <PropertyCard
                  key={property.id}
                  property={property}
                />

              ))}

            </div>

          )
        }


      </div>

    </main>
  );
}
