const features = [
  {
    title: "Verified Properties",
    description:
      "100% verified listings from trusted owners and builders.",
    icon: "✓",
  },
  {
    title: "Best Price Deals",
    description:
      "Compare properties and find the right value for your budget.",
    icon: "₹",
  },
  {
    title: "Prime Locations",
    description:
      "Explore properties in top locations across India.",
    icon: "⌖",
  },
  {
    title: "Trusted Builders",
    description:
      "Connect with reputed and reliable developers.",
    icon: "◆",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F8FAF8] py-24 text-slate-900">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-black text-green-700">
            Why PropertyHub
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
            Why Choose <span className="text-green-600">PropertyHub?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            A smarter, safer and simpler way to find your perfect property.
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="
                group
                rounded-3xl
                border border-slate-200
                bg-white
                p-8
                text-center
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-green-200
                hover:shadow-lg
              "
            >

              <div
                className="
                  mx-auto
                  flex h-20 w-20
                  items-center justify-center
                  rounded-2xl
                  border border-green-100
                  bg-green-50
                  text-4xl
                  font-black
                  text-green-600
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:bg-green-100
                "
              >
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
