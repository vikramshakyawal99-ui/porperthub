import Link from "next/link";

const groups = [
  {
    title: "New",
    desc: "Explore brand-new properties from builders and developers",
    cards: [
      {
        title: "Flat",
        icon: "🏠",
        desc: "Premium apartments & flats",
        link: "/properties?type=flat&purpose=new",
      },
      {
        title: "Villa",
        icon: "🏡",
        desc: "Luxury villas & homes",
        link: "/properties?type=villa&purpose=new",
      },
      {
        title: "House",
        icon: "🏘️",
        desc: "Independent new houses",
        link: "/properties?type=house&purpose=new",
      },
      {
        title: "Plot",
        icon: "🌳",
        desc: "New residential plots",
        link: "/properties?type=plot&purpose=new",
      },
    ],
  },
  {
    title: "Resale",
    desc: "Find pre-owned properties available directly from sellers",
    cards: [
      {
        title: "Apartment",
        icon: "🏢",
        desc: "Ready-to-buy resale apartments",
        link: "/properties?type=flat&purpose=resale",
      },
      {
        title: "Villa",
        icon: "🏡",
        desc: "Resale villas & homes",
        link: "/properties?type=villa&purpose=resale",
      },
      {
        title: "House",
        icon: "🏘️",
        desc: "Independent resale houses",
        link: "/properties?type=house&purpose=resale",
      },
      {
        title: "Plot",
        icon: "🌳",
        desc: "Resale residential plots",
        link: "/properties?type=plot&purpose=resale",
      },
    ],
  },
  {
    title: "Rent",
    desc: "Comfortable rental options for every lifestyle",
    cards: [
      {
        title: "Flat",
        icon: "🏠",
        desc: "Rental flats & apartments",
        link: "/properties?type=flat&purpose=rent",
      },
      {
        title: "House",
        icon: "🏘️",
        desc: "Independent rental houses",
        link: "/properties?type=house&purpose=rent",
      },
      {
        title: "PG",
        icon: "🛏️",
        desc: "Boys, girls & co-living PG",
        link: "/properties?type=pg&purpose=rent",
      },
      {
        title: "Hostel",
        icon: "🏫",
        desc: "Student & working hostels",
        link: "/properties?type=hostel&purpose=rent",
      },
      {
        title: "Room",
        icon: "🚪",
        desc: "Comfortable rental rooms",
        link: "/properties?type=room_rent&purpose=rent",
      },
    ],
  },
];

export default function PropertyCategories() {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-slate-900">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-green-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold tracking-wide text-green-700">
            Property Categories
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Explore Properties That Fit Your Lifestyle
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Choose the property type that fits your needs
          </p>
        </div>

        <div className="space-y-14">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-7 text-center">
                <h3 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  {group.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
                  {group.desc}
                </p>
              </div>

              <div
                className={`grid gap-5 ${
                  group.cards.length === 5
                    ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                    : "sm:grid-cols-2 md:grid-cols-4"
                }`}
              >
                {group.cards.map((item) => (
                  <Link
                    key={`${group.title}-${item.title}`}
                    href={item.link}
                    className="group relative overflow-hidden rounded-3xl border border-green-100 bg-white p-7 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)]"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-100/0 blur-3xl transition-all duration-300 group-hover:bg-green-100/80" />

                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:border-green-200 group-hover:bg-green-100">
                      {item.icon}
                    </div>

                    <h4 className="relative mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-green-700">
                      {item.title}
                    </h4>

                    <p className="relative mt-2 text-sm leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
