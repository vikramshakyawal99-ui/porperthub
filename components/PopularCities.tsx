const cities = [
  "Jaipur",
  "Delhi",
  "Gurgaon",
  "Noida",
  "Mumbai",
  "Pune",
  "Bengaluru",
  "Hyderabad",
];

export default function PopularCities() {
  return (
    <section className="bg-zinc-900 py-16">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-8 text-3xl font-bold text-white">
          Popular Cities
        </h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city}
              className="cursor-pointer rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {city}
              </h3>

              <p className="mt-2 text-gray-600">
                Explore Properties
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
