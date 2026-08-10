import Link from "next/link";

const categories = [
  {
    title: "Flat",
    icon: "🏠",
    desc: "Premium apartments & flats",
    link: "/properties?type=flat",
  },
  {
    title: "Villa",
    icon: "🏡",
    desc: "Luxury villas & homes",
    link: "/properties?type=villa",
  },
  {
    title: "House",
    icon: "🏘️",
    desc: "Independent houses",
    link: "/properties?type=house",
  },
  {
    title: "Plot",
    icon: "🌳",
    desc: "JDA & society plots",
    link: "/properties?type=plot",
  },
  {
    title: "PG",
    icon: "🛏️",
    desc: "Boys, girls & co-living PG",
    link: "/properties?type=pg",
  },
  {
    title: "Hostel",
    icon: "🏫",
    desc: "Student & working hostel",
    link: "/properties?type=hostel",
  },
  {
    title: "Room",
    icon: "🚪",
    desc: "Comfortable rental rooms",
    link: "/properties?type=room_rent",
  },
];

export default function PropertyCategories() {
  return (
    <section className="relative overflow-hidden bg-[#0d0b08] py-20">
      {/* Luxury gold ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
            
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#b8aa91]">
            Explore premium properties selected for your lifestyle
          </p>
        </div>

        {/* Property Cards */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-[#c9a45c]/20
                bg-[#17130e]
                p-7
                text-center
                backdrop-blur-xl
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-amber-400/30
                hover:bg-[#1d1810]
                hover:shadow-[0_20px_60px_rgba(212,168,85,0.10)]
              "
            >
              {/* Gold hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-400/0 blur-3xl transition-all duration-300 group-hover:bg-[#c9a45c]/10" />

              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-2xl
                  border border-[#c9a45c]/20
                  bg-[#211a10]
                  text-4xl
                  shadow-inner
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:border-amber-400/30
                  group-hover:bg-[#c9a45c]/10
                "
              >
                {item.icon}
              </div>

              <h3 className="relative mt-5 text-xl font-bold text-white transition-colors group-hover:text-amber-400">
                {item.title}
              </h3>

              <p className="relative mt-2 text-sm leading-6 text-[#b8aa91]">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
