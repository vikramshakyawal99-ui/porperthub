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
    <section className="relative overflow-hidden py-24">
      {/* Luxury glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#60A5FA]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* HEADER */}
        <div className="mb-14 text-center">

          <span className="inline-flex rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-5 py-2 text-sm font-black text-[#60A5FA]">
            Customer Experience
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
            What Our Customers Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#bdb7ad]">
            Trusted by people finding their dream properties.
          </p>

        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="grid gap-7 md:grid-cols-3">

          {testimonials.map((item) => (

            <div
              key={item.id}
              className="
                group
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-8
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#60A5FA]/40
                hover:bg-white/[0.06]
                hover:shadow-[0_20px_50px_rgba(212,168,85,0.10)]
              "
            >

              {/* USER + RATING */}
              <div className="flex items-center justify-between gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 text-2xl text-[#60A5FA] shadow-[inset_0_0_20px_rgba(212,168,85,0.08)]">
                  👤
                </div>

                <div className="text-lg tracking-wide text-[#60A5FA]">
                  ★★★★★
                </div>

              </div>

              {/* REVIEW */}
              <p className="mt-6 leading-7 text-[#c8c3ba]">
                “{item.review}”
              </p>

              {/* USER INFO */}
              <div className="mt-7 border-t border-white/10 pt-5">

                <h3 className="text-lg font-bold text-[#f2ede4]">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-[#aaa49a]">
                  📍 {item.city}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
