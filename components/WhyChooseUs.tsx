const features = [
  {
    title: "Verified Properties",
    description:
      "100% verified listings from trusted owners and builders.",
    icon: "✅",
  },
  {
    title: "Best Price Deals",
    description:
      "Compare properties and find the right value for your budget.",
    icon: "💰",
  },
  {
    title: "Prime Locations",
    description:
      "Explore properties in top locations across India.",
    icon: "📍",
  },
  {
    title: "Trusted Builders",
    description:
      "Connect with reputed and reliable developers.",
    icon: "🤝",
  },
];


export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 via-white to-slate-50">

      <div className="mx-auto max-w-7xl px-6">


        <div className="mb-12 text-center">

          <p className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
            Why PropertyHub
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
            Why Choose PropertyHub?
          </h2>

          <p className="mt-3 text-slate-600">
            A smarter and safer way to find your perfect property.
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
                bg-white/90
                p-8
                text-center
                shadow-xl
                backdrop-blur
                transition-all duration-300
                hover:-translate-y-3
                hover:border-blue-300
                hover:shadow-2xl
              "
            >


              <div
                className="
                  mx-auto
                  flex h-20 w-20
                  items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br from-blue-100 to-indigo-100
                  text-5xl
                  shadow-inner
                  transition duration-300
                  group-hover:scale-110
                  group-hover:rotate-3
                "
              >
                {feature.icon}
              </div>



              <h3
                className="
                  mt-6
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                {feature.title}
              </h3>



              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                {feature.description}
              </p>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}
