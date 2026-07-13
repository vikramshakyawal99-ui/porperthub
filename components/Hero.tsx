import StatsCounter from "./StatsCounter";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">

        <h1 className="text-5xl font-bold">
          Find Your Dream Property
        </h1>

        <p className="mt-5 text-lg text-blue-100">
          Buy • Rent • Commercial • Plots • New Projects
        </p>

        <div className="mt-10 rounded-2xl bg-white p-4 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row">

            <select className="rounded-lg border p-3 text-black md:w-52">
              <option>Buy</option>
              <option>Rent</option>
              <option>Commercial</option>
              <option>Plots</option>
            </select>

            <input
              type="text"
              placeholder="Search City, Locality or Project..."
              className="flex-1 rounded-lg border p-3 text-black"
            />

            <button className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600">
              Search
            </button>

          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">

          <StatsCounter
            end={500}
            label="Properties"
          />

          <StatsCounter
            end={100}
            label="Builders"
          />

          <StatsCounter
            end={10000}
            suffix="+"
            label="Happy Users"
          />

          <StatsCounter
            end={15}
            label="Cities"
          />

        </div>

      </div>
    </section>
  );
}   