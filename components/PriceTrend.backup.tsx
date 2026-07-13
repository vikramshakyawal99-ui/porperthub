"use client";

export default function PriceTrend() {
  const data = [
    { year: "2024", price: "₹75 Lakh" },
    { year: "2025", price: "₹85 Lakh" },
    { year: "2026", price: "₹98 Lakh" },
    { year: "2027", price: "₹1.15 Cr" },
    { year: "2028", price: "₹1.35 Cr" },
  ];

  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-xl">

      <h2 className="text-3xl font-bold">
        📈 Property Price Trend
      </h2>

      <p className="mt-2">
        Estimated market growth analysis
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-5">

        {data.map((item) => (
          <div
            key={item.year}
            className="rounded-2xl bg-white/20 p-5 text-center"
          >
            <h3 className="text-xl font-bold">
              {item.year}
            </h3>

            <p className="mt-3 text-2xl font-bold">
              {item.price}
            </p>
          </div>
        ))}

      </div>

      <div className="mt-8 rounded-2xl bg-white/20 p-5">

        <h3 className="text-xl font-bold">
          🚀 Investment Outlook
        </h3>

        <p className="mt-2">
          This property location shows strong growth potential
          based on connectivity, demand and infrastructure.
        </p>

      </div>

    </section>
  );
}
