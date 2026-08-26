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
    <section className="relative overflow-hidden bg-[#fbfaf8] py-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-green-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-700">
            Customer Experience
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            What Our Customers{" "}
            <span className="text-green-700">
              Say
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Trusted by people finding their dream properties.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group flex min-h-[310px] flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_45px_rgba(22,163,74,0.12)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-2xl">
                  👤
                </div>

                <div
                  className="text-base tracking-[0.15em] text-amber-400"
                  aria-label="5 star rating"
                >
                  ★★★★★
                </div>
              </div>

              <p className="mt-6 flex-1 text-[15px] leading-7 text-slate-600">
                “{item.review}”
              </p>

              <div className="mt-7 border-t border-slate-100 pt-5">
                <h3 className="text-lg font-black text-slate-950">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  📍 {item.city}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
