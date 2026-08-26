const builders = [
  {
    name: "Manglam Group",
    projects: 45,
    rating: 4.8,
  },
  {
    name: "Mahima Group",
    projects: 38,
    rating: 4.7,
  },
  {
    name: "Ashiana Housing",
    projects: 30,
    rating: 4.9,
  },
  {
    name: "Unique Builders",
    projects: 28,
    rating: 4.6,
  },
  {
    name: "Chordia Group",
    projects: 22,
    rating: 4.7,
  },
  {
    name: "ARG Group",
    projects: 20,
    rating: 4.6,
  },
];

export default function BuildersPage() {
  return (
    <section className="min-h-screen bg-black py-16">

      <div className="mx-auto max-w-7xl px-6">

        <h1 className="text-center text-5xl font-black text-white">
          Top Builders
        </h1>

        <p className="mt-3 text-center text-gray-400">
          Trusted developers of Jaipur
        </p>


        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {builders.map((builder)=>(
            <div
              key={builder.name}
              className="
              rounded-2xl
              border border-[#d4a855]/30
              bg-white/5
              p-6
              text-center
              "
            >

              <div className="text-4xl">
                🏢
              </div>

              <h2 className="mt-4 text-xl font-bold text-white">
                {builder.name}
              </h2>

              <p className="mt-2 text-[#d4a855]">
                ⭐ {builder.rating}
              </p>

              <p className="mt-2 text-white">
                {builder.projects}+ Projects
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
