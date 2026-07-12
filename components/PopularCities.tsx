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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Popular Cities
        </h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {cities.map((city) => (
            <div
              key={city}
              className="cursor-pointer rounded-xl border bg-gray-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold">{city}</h3>
              <p className="mt-2 text-gray-500">
                Explore Properties
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}