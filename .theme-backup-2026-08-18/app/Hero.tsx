export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white py-20 text-slate-900 md:py-24">
      
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">

        <div className="mx-auto max-w-4xl">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold text-green-700">
            Trusted Real Estate Platform
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Find Your Perfect Property
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Buy, rent or discover new properties from trusted owners,
            builders and verified real estate professionals.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-green-100 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-3 md:flex-row">

            <select
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 outline-none focus:border-green-500 md:w-48"
              defaultValue="Buy"
            >
              <option>Buy</option>
              <option>Rent</option>
              <option>New Projects</option>
              <option>Resale</option>
            </select>

            <input
              type="text"
              placeholder="Search city, locality or project..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
            />

            <button className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white shadow-sm transition hover:bg-green-700">
              Search Properties
            </button>

          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full border border-green-100 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm">
            ✓ Verified Properties
          </span>
          <span className="rounded-full border border-green-100 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm">
            ✓ Trusted Builders
          </span>
          <span className="rounded-full border border-green-100 bg-white px-4 py-2 font-medium text-slate-600 shadow-sm">
            ✓ Direct Owners
          </span>
        </div>

      </div>
    </section>
  );
}
