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
    <section className="py-24 bg-gradient-to-b from-blue-50 via-white to-slate-50">

      <div className="mx-auto max-w-7xl px-6">


        <div className="mb-12 text-center">

          <p className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
            Customer Experience
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
            What Our Customers Say
          </h2>

          <p className="mt-3 text-slate-600">
            Trusted by people finding their dream properties.
          </p>

        </div>



        <div className="grid gap-6 md:grid-cols-3">


          {testimonials.map((item) => (

            <div
              key={item.id}
              className="
                rounded-3xl
                bg-white/90
                border border-slate-200
                p-8
                shadow-xl
                backdrop-blur
                transition-all duration-300
                hover:-translate-y-3
                hover:shadow-2xl
              "
            >


              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl text-white shadow-lg">
                  👤
                </div>

                <div className="text-xl">
                  ⭐⭐⭐⭐⭐
                </div>

              </div>



              <p className="
                mt-5
                leading-7
                text-slate-600
              ">
                “{item.review}”
              </p>



              <div className="mt-6">

                <h3 className="
                  text-lg
                  font-bold
                  text-slate-900
                ">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500">
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
