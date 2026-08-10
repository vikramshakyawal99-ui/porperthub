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
    <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">

          <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
            Explore Locations
          </span>

          <h2 className="mt-5 text-5xl font-black tracking-tight text-slate-900">
            Popular Cities
          </h2>

          <p className="mt-3 text-slate-600">
            Discover premium properties across India's top cities
          </p>

        </div>


        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {cities.map((city) => (

            <Link
              href={city.link}
              key={city.name}
              className="
              group
              rounded-3xl
              bg-white
              p-7
              border border-slate-200
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-2
              hover:shadow-2xl
              "
            >

              <div className="
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-gradient-to-br from-blue-100 to-indigo-100
                text-4xl
                transition
                group-hover:scale-110
              ">
                {city.icon}
              </div>


              <h3 className="
                mt-6
                text-2xl
                font-black
                text-slate-900
              ">
                {city.name}
              </h3>


              <p className="mt-2 text-sm text-slate-600">
                {city.desc}
              </p>


              <p className="
                mt-5
                text-sm
                font-bold
                text-blue-600
              ">
                {city.count}
              </p>


              <div className="
                mt-5
                text-sm
                font-bold
                text-slate-700
                transition
                group-hover:text-blue-600
              ">
                View Properties →
              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}
