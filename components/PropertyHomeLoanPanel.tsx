import Link from "next/link";

export default function PropertyHomeLoanPanel({
  propertyTitle,
  propertyPrice,
}: {
  propertyTitle: string;
  propertyPrice: string;
}) {
  return (
    <section className="mt-10 rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50/60 p-6 shadow-[0_12px_38px_rgba(22,163,74,0.09)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-700">
            PropertyHub Home Loan
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Finance your dream property
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Check indicative eligibility, compare loan
            offers and submit your requirement for{" "}
            <strong>{propertyTitle}</strong>
            {propertyPrice
              ? ` priced at ${propertyPrice}`
              : ""}.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/#home-loan"
            className="inline-flex min-h-12 items-center justify-between gap-6 rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-black text-green-800 transition hover:border-green-400 hover:bg-green-50"
          >
            Check Loan Eligibility
            <span className="text-green-600">→</span>
          </Link>

          <Link
            href="/#home-loan"
            className="inline-flex min-h-12 items-center justify-between gap-6 rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
          >
            Compare & Apply
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
