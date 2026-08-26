import Image from "next/image";
import Link from "next/link";
import { dealers } from "../data/dealers";

export default function PropertyDealers() {
  return (
    <section className="relative overflow-hidden bg-white py-20 text-slate-900">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold tracking-wide text-green-700">
            Trusted Professionals
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Trusted Property Dealers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Connect with verified property dealers for expert guidance and trusted real estate assistance.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dealers.map((dealer) => (
            <div
              key={dealer.id}
              className="group rounded-3xl border border-green-100 bg-white p-6 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)]"
            >
              <div className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full border-4 border-green-100 shadow-md">
                <Image
                  src={dealer.image}
                  alt={dealer.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {dealer.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {dealer.location}
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <a
                  href={`tel:${dealer.phone}`}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/${dealer.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-100"
                >
                  🟢 WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dealer"
            className="inline-block rounded-xl bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700"
          >
            Explore More Dealers →
          </Link>
        </div>
      </div>
    </section>
  );
}
