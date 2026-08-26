import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    name: "Mahima Panorama",
    location: "Jagatpura, Jaipur",
    price: "Starting ₹65 Lac",
    builder: "Mahima Group",
    image: "/hero-integrated.png",
  },
  {
    id: 2,
    name: "Vatika Infotech City",
    location: "Ajmer Road, Jaipur",
    price: "Starting ₹72 Lac",
    builder: "Vatika Group",
    image: "/hero-property.jpg",
  },
  {
    id: 3,
    name: "Manglam Radiance",
    location: "Vaishali Nagar, Jaipur",
    price: "Starting ₹58 Lac",
    builder: "Manglam Group",
    image: "/og-image.jpg",
  },
];

export default function LatestProjects() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf8] py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-green-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-700">
            New Launches
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Discover Latest{" "}
            <span className="text-green-700">
              Projects
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Explore upcoming premium residential projects from trusted builders.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_45px_rgba(22,163,74,0.12)]"
            >
              <div className="relative h-64 overflow-hidden bg-green-50">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-green-600 px-4 py-2 text-[10px] font-black tracking-wide text-white shadow-lg">
                  NEW PROJECT
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-slate-950">
                  {project.name}
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  📍 {project.location}
                </p>

                <p className="mt-4 text-xl font-black text-green-700">
                  {project.price}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Builder
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {project.builder}
                  </p>
                </div>

                <Link
                  href={`/properties?builder=${encodeURIComponent(
                    project.builder
                  )}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl border border-green-600 bg-white px-5 py-3 font-black text-green-700 transition hover:bg-green-600 hover:text-white"
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
