const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    city: "Jaipur",
    review:
      "PropertyHub made my home search very easy. The listings were genuine and well organized.",
  },
  {
    id: 2,
    name: "Priya Verma",
    city: "Delhi",
    review:
      "I found my dream apartment within a week. Highly recommended for property buyers.",
  },
  {
    id: 3,
    name: "Amit Singh",
    city: "Gurgaon",
    review:
      "Very clean interface and verified projects. I would definitely use it again.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-zinc-900 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-gray-50 p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="text-gray-300">
                &ldquo;{item.review}&rdquo;
              </p>

              <h3 className="mt-6 text-lg font-semibold">
                {item.name}
              </h3>

              <p className="text-sm text-white">
                {item.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}