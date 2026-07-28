import Link from "next/link";

export default function PropertyCategories() {

  const categories = [
    {
      title: "Buy Property",
      icon: "🏠",
      desc: "New & resale properties",
      link: "/properties?purpose=buy",
    },
    {
      title: "Rent Property",
      icon: "🔑",
      desc: "Homes, rooms and rental options",
      link: "/properties?purpose=rent",
    },
    {
      title: "Flat / Apartment",
      icon: "🏢",
      desc: "Modern flats and apartments",
      link: "/properties?type=flat",
    },
    {
      title: "Villa / House",
      icon: "🏡",
      desc: "Independent villas and houses",
      link: "/properties?type=villa",
    },
    {
      title: "Plot",
      icon: "📐",
      desc: "JDA approved & society plots",
      link: "/properties?type=plot",
    },
    {
      title: "Room",
      icon: "🛏️",
      desc: "Single room and shared rooms",
      link: "/properties?type=room_rent",
    },
    {
      title: "PG",
      icon: "🏘️",
      desc: "Boys PG and girls PG",
      link: "/properties?type=pg",
    },
    {
      title: "Hostel",
      icon: "🏫",
      desc: "Student and working hostel",
      link: "/properties?type=hostel",
    },
  ];


  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">

      <h2 className="mb-10 text-center text-4xl font-bold text-zinc-900">
        🏠 Explore Properties
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {categories.map((item)=>(

          <Link
            key={item.title}
            href={item.link}
            className="rounded-3xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="text-5xl">
              {item.icon}
            </div>

            <h3 className="mt-5 text-2xl font-bold text-zinc-900">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-600">
              {item.desc}
            </p>

          </Link>

        ))}

      </div>

    </section>
  );
}
