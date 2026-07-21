export default function TopBuilders() {
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

  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">
      <h2 className="mb-10 text-center text-4xl font-bold">
        🏢 Top Builders
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {builders.map((builder) => (
          <div
            key={builder.name}
            className="rounded-3xl border bg-zinc-900 p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl">
              🏗️
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              {builder.name}
            </h3>

            <p className="mt-2 text-gray-300">
              📍 {builder.city}
            </p>

            <p className="mt-2">
              ⭐ {builder.rating}
            </p>

            <p className="mt-2">
              🏘️ {builder.projects} Projects
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}