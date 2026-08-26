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
    <section className="bg-green-50/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="inline-flex rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-bold tracking-wide text-green-700 shadow-sm">
            Trusted Developers
          </p>

          <h2 className="mt-5 text-4xl font-black text-slate-900">
            Top Builders
          </h2>

          <p className="mt-2 text-slate-500">
            Trusted developers of Jaipur
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {builders.map((builder) => (
            <div
              key={builder.name}
              className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)]"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-2xl">
                🏢
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {builder.name}
              </h3>

              <p className="mt-2 text-slate-500">
                📍 {builder.city}
              </p>

              <p className="mt-3 font-bold text-green-700">
                ⭐ {builder.rating}
              </p>

              <p className="mt-2 text-slate-600">
                {builder.projects}+ Projects
              </p>

              <Link
                href={`/properties?builder=${encodeURIComponent(builder.name)}`}
                className="mt-6 block w-full rounded-xl bg-green-600 py-3 text-center font-bold text-white transition hover:bg-green-700"
              >
                View Projects →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/builders"
            className="inline-block rounded-xl border border-green-200 bg-white px-8 py-3 font-bold text-green-700 shadow-sm transition hover:bg-green-50"
          >
            View More Builders →
          </Link>
        </div>
      </div>
    </section>
  );
}
