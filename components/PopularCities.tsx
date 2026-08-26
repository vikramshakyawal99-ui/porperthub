import Link from "next/link";

const cities = [
  {
    name: "Jaipur",
    icon: "🏰",
    desc: "Premium homes & new projects",
    count: "1200+ Properties",
    link: "/jaipur",
  },
  {
    name: "Delhi",
    icon: "🏙️",
    desc: "Luxury homes & apartments",
    count: "2500+ Properties",
    link: "/delhi",
  },
  {
    name: "Gurgaon",
    icon: "🌆",
    desc: "Corporate living spaces",
    count: "1800+ Properties",
    link: "/gurgaon",
  },
  {
    name: "Noida",
    icon: "🏢",
    desc: "Modern apartments",
    count: "1500+ Properties",
    link: "/noida",
  },
  {
    name: "Mumbai",
    icon: "🌃",
    desc: "City lifestyle properties",
    count: "3000+ Properties",
    link: "/mumbai",
  },
  {
    name: "Pune",
    icon: "🏡",
    desc: "Residential communities",
    count: "1400+ Properties",
    link: "/pune",
  },
  {
    name: "Bengaluru",
    icon: "🌿",
    desc: "Tech city properties",
    count: "2200+ Properties",
    link: "/bengaluru",
  },
  {
    name: "Hyderabad",
    icon: "🏘️",
    desc: "Affordable luxury homes",
    count: "1700+ Properties",
    link: "/hyderabad",
  },
];

export default function PopularCities() {
  return (
    <section className="relative overflow-hidden bg-green-50/40 py-20">
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-green-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-bold tracking-wide text-green-700 shadow-sm">
            Explore Locations
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Explore Properties Across Top Cities
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Discover verified properties across India&apos;s top cities
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <Link
              href={city.link}
              key={city.name}
              className="group relative overflow-hidden rounded-3xl border border-green-100 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-green-100/0 blur-3xl transition-all duration-300 group-hover:bg-green-100/80" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:border-green-200 group-hover:bg-green-100">
                {city.icon}
              </div>

              <h3 className="relative mt-6 text-2xl font-black text-slate-900 transition-colors group-hover:text-green-700">
                {city.name}
              </h3>

              <p className="relative mt-2 text-sm leading-6 text-slate-500">
                {city.desc}
              </p>

              <p className="relative mt-5 text-sm font-bold text-green-700">
                {city.count}
              </p>

              <div className="relative mt-5 text-sm font-bold text-slate-600 transition-colors group-hover:text-green-700">
                View Properties →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
