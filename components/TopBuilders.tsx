import Link from "next/link";
const builders = [
  {
    name: "Manglam Group",
    city: "Jaipur",
    projects: 45,
    rating: 4.8,
  },
  {
    name: "Mahima Group",
    city: "Jaipur",
    projects: 38,
    rating: 4.7,
  },
  {
    name: "Ashiana Housing",
    city: "Jaipur",
    projects: 30,
    rating: 4.9,
  },
  {
    name: "Unique Builders",
    city: "Jaipur",
    projects: 28,
    rating: 4.6,
  },
];

export default function TopBuilders() {
  return (
    <section className="py-16">

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white">
          🏗️ Top Builders
        </h2>

        <p className="text-gray-400 mt-2">
          Trusted developers of Jaipur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {builders.map((builder) => (
          <div
            key={builder.name}
            className="
            rounded-2xl
            border border-yellow-500/30
            bg-black/30
            p-6
            text-center
            shadow-lg
            hover:border-yellow-400
            hover:-translate-y-1
            transition
            "
          >

            <div className="
              mx-auto
              mb-5
              h-16
              w-16
              rounded-full
              bg-yellow-500
              flex
              items-center
              justify-center
              text-2xl
              font-bold
              text-black
            ">
              🏢
            </div>

            <h3 className="text-xl font-bold text-white">
              {builder.name}
            </h3>

            <p className="text-gray-400 mt-2">
              📍 {builder.city}
            </p>

            <p className="text-yellow-400 mt-3">
              ⭐ {builder.rating}
            </p>

            <p className="text-white mt-2">
              {builder.projects}+ Projects
            </p>

            <button
              className="
              mt-6
              w-full
              rounded-xl
              bg-yellow-500
              py-3
              font-bold
              text-black
              hover:bg-yellow-400
              transition
              "
            >
              View Projects →
            </button>

          </div>
        ))}

      </div>

      <div className="mt-10 text-center">
    <Link
      href="/builders"
      className="inline-block rounded-xl bg-yellow-500 px-8 py-3 font-bold text-black hover:bg-yellow-400 transition"
    >
      View More Builders →
    </Link>
      </div>
    </section>
  );
}