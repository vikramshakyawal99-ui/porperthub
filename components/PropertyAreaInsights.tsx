import Link from "next/link";
import {
  locationToAreaSlug,
  resolveInvestmentArea,
} from "@/lib/resolveInvestmentArea";

export default function PropertyAreaInsights({
  location,
}: {
  location: string;
}) {
  const area = resolveInvestmentArea(location);

  const slug =
    locationToAreaSlug(location);

  const href = area
    ? `/investment-areas/${area.id}`
    : `/area-insights/${slug}?location=${encodeURIComponent(
        location
      )}`;

  return (
    <Link
      href={href}
      className="group mt-7 block rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/50 to-white p-5 shadow-[0_8px_28px_rgba(22,163,74,0.08)] transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_16px_38px_rgba(22,163,74,0.13)] sm:p-6"
    >
      <div className="flex items-center gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-xl">
            📊
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-green-700">
              Area Market Insights
            </p>

            <h3 className="mt-1 truncate text-lg font-black text-slate-900 sm:text-xl">
              {area?.name || location}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Demand, price growth, projects and government schemes
            </p>
          </div>
        </div>

        <div className="hidden h-16 min-w-40 items-end justify-between rounded-2xl bg-green-50 px-4 pb-3 pt-2 sm:flex">
          {[18, 27, 36, 45, 56].map(
            (height, index) => (
              <div
                key={index}
                className="w-2 rounded-full bg-green-500/70"
                style={{
                  height: `${height}%`,
                }}
              />
            )
          )}
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-green-200 bg-white text-xl font-black text-green-700 transition group-hover:translate-x-1 group-hover:bg-green-600 group-hover:text-white">
          →
        </span>
      </div>

      {!area && (
        <p className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-700">
          Area insights are being prepared
        </p>
      )}
    </Link>
  );
}
