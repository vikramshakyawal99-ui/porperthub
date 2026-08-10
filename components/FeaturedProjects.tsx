import Image from "next/image";
import Link from "next/link";
import { properties } from "../data/properties";

export default function FeaturedProjects() {
  const featuredProjects = properties.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#17120d] via-[#21180d] to-[#120f0b] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <p className="mx-auto inline-block rounded-full border border-amber-400/20 bg-white/5 px-5 py-2 text-sm font-semibold tracking-wide text-amber-400 backdrop-blur-md">
            Featured Projects
          </p>

          <h2 className="mt-5 text-5xl font-black tracking-tight text-white">
            Featured Projects
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Explore premium homes and thoughtfully designed spaces from trusted builders.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredProjects.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-3xl border border-amber-400/10 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/30">

                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                    {property.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    📍 {property.location}
                  </p>

                  <p className="mt-4 text-2xl font-black text-amber-400">
                    {property.price}
                  </p>

                  <div className="mt-5 font-bold text-amber-400 transition-colors group-hover:text-amber-300">
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
