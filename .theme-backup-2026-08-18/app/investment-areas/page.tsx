import Link from "next/link";
import { investmentAreas } from "@/data/investmentAreas";
import { jaipurGrowthAreas } from "@/data/jaipurGrowthAreas";

export default function InvestmentAreasPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-green-100 bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

          <p className="inline-flex rounded-full border border-green-100 bg-green-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
            PropertyHub Investment Radar
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.03em] leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
            Where is Jaipur
            <br />
            growing next?
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Explore Jaipur's emerging growth corridors, developing
            micro-markets and established investment locations.
          </p>

        </div>
      </section>

      {/* AREAS */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">

        <div className="mb-7">
          <p className="text-sm font-medium text-slate-500">
            {investmentAreas.length} locations tracked
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {investmentAreas.map((area) => {
            const growthArea = jaipurGrowthAreas.find(
              (item) => item.id === area.id
            );

            return (
              <article
              key={area.id}
              className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_18px_45px_rgba(22,163,74,0.12)]"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    📍 {area.city}
                  </p>

                  <h2 className="mt-1 text-[22px] font-extrabold tracking-tight text-slate-900">
                    {area.name}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black tracking-tight text-green-700">
                    {area.score}
                    <span className="text-xs font-semibold text-slate-400">
                      /10
                    </span>
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Growth
                  </p>
                </div>

              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                  {area.category}
                </span>

                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {area.marketPosition}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-green-100/80 bg-gradient-to-br from-green-50 via-white to-white p-4 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Entry Level
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {area.entryLevel}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-100/80 bg-gradient-to-br from-green-50 via-white to-white p-4 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Future Potential
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {area.futurePotential}
                  </p>
                </div>

              </div>

              {/* GROWTH RADAR */}

              <div className="mt-4 grid grid-cols-2 gap-2">

                <RadarStat
                  title="Demand"
                  signal={growthArea?.demand}
                />

                <RadarStat
                  title="Price Momentum"
                  signal={growthArea?.priceMomentum}
                />

                <RadarStat
                  title="New Supply"
                  signal={growthArea?.newSupply}
                />

                <RadarStat
                  title="Buyer Activity"
                  signal={growthArea?.buyerActivity}
                />

                <RadarStat
                  title="Development"
                  signal={growthArea?.development}
                />

              </div>

              <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-600">
                {area.outlook}
              </p>

              <Link
                href={`/investment-areas/${area.id}`}
                className="mt-5 flex w-full items-center justify-between rounded-2xl border border-green-200 bg-green-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md"
              >
                <span>Explore Area</span>
                <span className="text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>

              </article>
            );
          })}

        </div>

      </section>

    </main>
  );
}

function RadarStat({
  title,
  signal,
}: {
  title: string;
  signal?: {
    status: string;
    score: number;
    dataPoints: number;
  };
}) {
  const verified =
    signal &&
    signal.status !== "unknown" &&
    signal.dataPoints > 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-colors group-hover:border-green-100 group-hover:bg-green-50/50">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {verified
          ? signal.status.replace("_", " ")
          : "—"}
      </p>
    </div>
  );
}
