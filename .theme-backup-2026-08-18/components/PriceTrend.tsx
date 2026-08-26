"use client";

type Props = {
  price?: string | number;
};

export default function PriceTrend({ price }: Props) {
  const currentPrice = price || "Price unavailable";

  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-r from-[#15120d] to-[#211a10] p-8 text-white shadow-xl border border-[#d4a855]/20">

      <h2 className="text-3xl font-bold">
        📈 Property Price
      </h2>

      <p className="mt-2 text-[#b8aa91]">
        Current price provided for this property
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-[#d4a855]/20 bg-[#d4a855]/10 p-6 text-center">
          <h3 className="text-sm font-semibold text-[#b8aa91]">
            Current Asking Price
          </h3>

          <p className="mt-3 text-3xl font-black text-[#d4a855]">
            ₹ {currentPrice}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h3 className="text-sm font-semibold text-[#b8aa91]">
            Historical Data
          </h3>

          <p className="mt-3 text-lg font-bold text-white">
            Not Available
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h3 className="text-sm font-semibold text-[#b8aa91]">
            Future Estimate
          </h3>

          <p className="mt-3 text-lg font-bold text-white">
            Not Available
          </p>
        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-[#d4a855]/15 bg-white/5 p-5">

        <h3 className="text-xl font-bold">
          🚀 Investment Outlook
        </h3>

        <p className="mt-2 text-white/70">
          Historical and future price estimates will only be shown
          when verified market data is available.
        </p>

      </div>

    </section>
  );
}
