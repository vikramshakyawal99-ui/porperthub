const features = [
  {
    title: "Verified Properties",
    description: "100% verified property listings from trusted builders.",
    icon: "✅",
  },
  {
    title: "Best Price",
    description: "Compare prices and get the best property deals.",
    icon: "💰",
  },
  {
    title: "Prime Locations",
    description: "Explore properties in the best locations across India.",
    icon: "📍",
  },
  {
    title: "Trusted Builders",
    description: "Buy only from verified and reputed builders.",
    icon: "🤝",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-zinc-900 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Why Choose PropertyHub?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-gray-50 p-6 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 text-5xl">
                {feature.icon}
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}