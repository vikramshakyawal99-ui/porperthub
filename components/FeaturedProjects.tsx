import Link from "next/link";
import { properties } from "../data/properties";

export default function FeaturedProjects() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-5xl font-bold text-gray-900">
            🌟 Featured Projects
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Handpicked premium properties for you
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {properties.map((property) => (

            <Link
              key={property.id}
              href={`/properties/${property.id}`}
            >
              <div className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">

                <div className="relative overflow-hidden">

                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white">
                    New Launch
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-bold shadow">
                    ⭐ {property.rating}
                  </span>

                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-bold">
                    {property.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    📍 {property.location}
                  </p>

                  <p className="mt-3 text-blue-700 text-2xl font-bold">
                    {property.price}
                  </p>

                  <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700">
                    View Project
                  </button>

                </div>

              </div>
            </Link>

          ))}

        </div>

      </div>
    </section>
  );
}