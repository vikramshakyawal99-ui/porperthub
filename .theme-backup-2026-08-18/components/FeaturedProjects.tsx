import Image from "next/image";
import Link from "next/link";
import { properties } from "../data/properties";

export default function FeaturedProjects() {
  const featuredProjects = properties.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mx-auto inline-block rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold tracking-wide text-green-700">
            Latest Projects
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Discover Latest Projects
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Explore new homes and thoughtfully designed spaces from trusted builders.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredProjects.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)]">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    FEATURED
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-green-700">
                    {property.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    📍 {property.location}
                  </p>

                  <p className="mt-4 text-2xl font-black text-green-700">
                    {property.price}
                  </p>

                  <div className="mt-5 font-bold text-green-700">
                    View Details →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
