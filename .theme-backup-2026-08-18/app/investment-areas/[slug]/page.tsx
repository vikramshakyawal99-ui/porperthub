import Link from "next/link";
import { notFound } from "next/navigation";
import { investmentAreas } from "@/data/investmentAreas";
import { getMicroLocations } from "@/data/microLocations";
import { jaipurGrowthAreas } from "@/data/jaipurGrowthAreas";
import { calculateInvestmentIntelligence } from "@/lib/investmentIntelligence";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function InvestmentAreaPage({ params }: PageProps) {
  const { slug } = await params;

  const area = investmentAreas.find((item) => item.id === slug);

  if (!area) {
    notFound();
  }

  const microLocations = getMicroLocations(area.id);

  const growthArea = jaipurGrowthAreas.find(
    (item) => item.id === area.id
  );

  const investmentIntelligence = calculateInvestmentIntelligence(area.id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

          <Link
            href="/investment-areas"
            className="text-sm text-slate-500 transition hover:text-green-700"
          >
            ← Back to Investment Areas
          </Link>

          <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                PropertyHub Investment Radar
              </p>

              <h1 className="mt-3 text-4xl font-serif font-semibold sm:text-5xl">
                {area.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                📍 {area.city}
              </p>

              <div className="mt-5 inline-flex rounded-full border border-green-200/25 bg-green-600/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                {area.category}
              </div>
            </div>

            <div className="rounded-2xl border border-green-200/25 bg-white px-7 py-5 text-center">
              <p className="text-4xl font-bold text-green-700">
                {area.score}
                <span className="text-base font-medium text-slate-500">
                  /10
                </span>
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                Growth Potential
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SIGNALS */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Investment Signals
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            What is happening in this area?
          </h2>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {investmentIntelligence.signalExplanations.map((signal) => {

            const icons: Record<string, string> = {
              demand: "📈",
              priceMomentum: "₹",
              newSupply: "🏘️",
              buyerActivity: "👥",
              development: "🏗️",
              connectivity: "📍",
              futurePotential: "🔮",
            };

            const titles: Record<string, string> = {
              demand: "Demand",
              priceMomentum: "Price Momentum",
              newSupply: "New Supply",
              buyerActivity: "Buyer Activity",
              development: "Development",
              connectivity: "Connectivity",
              futurePotential: "Future Potential",
            };

            return (
              <SignalCard
                key={signal.signal}
                icon={icons[signal.signal] ?? "•"}
                title={titles[signal.signal] ?? signal.signal}
                value={signal.rating}
                score={signal.score}
                explanation={signal.explanation}
              />
            );
          })}

        </div>
      </section>

      {/* INVESTMENT SNAPSHOT */}
      <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Investment Snapshot
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Where does this market stand?
          </h2>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">

          <SnapshotCard
            title="Market Position"
            value={area.marketPosition}
          />

          <SnapshotCard
            title="Entry Level"
            value={area.entryLevel}
          />

          <SnapshotCard
            title="Future Potential"
            value={area.futurePotential}
          />

        </div>

      </section>

      {/* WHY THIS AREA */}
      <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Why This Area?
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            What is driving development?
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">

            {microLocations.length > 0
              ? Array.from(
                  new Set(
                    microLocations.flatMap(
                      (location) => location.developmentReasons
                    )
                  )
                ).slice(0, 6).map((reason) => (
                  <div
                    key={reason}
                    className="rounded-xl border border-slate-200 bg-green-50 p-4"
                  >
                    <div className="flex gap-3">
                      <span className="text-green-700">✓</span>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {reason}
                      </p>
                    </div>
                  </div>
                ))
              : (
                <p className="text-sm text-slate-500">
                  Development activity is currently being tracked for this
                  investment area.
                </p>
              )}

          </div>

        </div>

      </section>

      {/* MICRO LOCATIONS */}
      {microLocations.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
              Micro Locations
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Where within {area.name}?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Not every pocket inside an investment corridor behaves the same.
              PropertyHub tracks the smaller locations separately.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            {microLocations.map((location) => (
              <article
                key={location.id}
                className="rounded-2xl border border-slate-200 bg-white/80 p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      📍 {location.city}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      {location.name}
                    </h3>
                  </div>

                  <span className="rounded-full border border-green-200/20 bg-green-600/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                    {location.marketPosition}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">

                  <MiniStat
                    title="Entry"
                    value={location.entryLevel}
                  />

                  <MiniStat
                    title="Demand"
                    value={location.demand}
                  />

                  <MiniStat
                    title="Development"
                    value={location.newDevelopment}
                  />

                  <MiniStat
                    title="Future"
                    value={location.futurePotential}
                  />

                </div>

                <p className="mt-5 text-sm leading-relaxed text-slate-600">
                  {location.outlook}
                </p>

              </article>
            ))}

          </div>

        </section>
      )}

      {/* GROWTH DRIVERS */}
      {microLocations.some(
        (location) =>
          location.growthDrivers && location.growthDrivers.length > 0
      ) && (
        <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
              Growth Drivers
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              What is driving growth in this area?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              PropertyHub tracks the infrastructure, employment, education,
              connectivity and residential factors that can influence future
              property demand.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">

            {Array.from(
              microLocations
                .flatMap((location) =>
                  (location.growthDrivers ?? []).map((driver) => ({
                    ...driver,
                    microLocation: location.name,
                  }))
                )
                .reduce(
                  (groups, driver) => {
                    const nameKey = driver.name.trim().toLowerCase();

                    if (groups.seen.has(nameKey)) {
                      return groups;
                    }

                    groups.seen.add(nameKey);

                    const typeKey = driver.type.trim().toLowerCase();

                    const typeDrivers = groups.byType.get(typeKey) ?? [];
                    typeDrivers.push(driver);
                    groups.byType.set(typeKey, typeDrivers);

                    return groups;
                  },
                  {
                    byType: new Map<string, any[]>(),
                    seen: new Set<string>(),
                  }
                ).byType
            ).map(([type, drivers]) => {

              const safeDrivers = drivers ?? [];
              const first = safeDrivers[0];

              return (
                <article
                  key={type}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-green-700">
                        {first?.type}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-slate-900">
                        {first?.type} Growth Drivers
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {safeDrivers.length} signal{safeDrivers.length === 1 ? "" : "s"} tracked
                      </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full border border-green-200/20 bg-green-600/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                      {safeDrivers.length} Signal{safeDrivers.length === 1 ? "" : "s"}
                    </span>

                  </div>

                  <div className="mt-5 space-y-4">

                    {safeDrivers.map((driver, index) => (
                      <div
                        key={`${type}-${driver.name}-${driver.microLocation}-${index}`}
                        className="rounded-xl border border-slate-200 bg-green-50 p-4"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              {driver.name}
                            </h4>

                            <p className="mt-1 text-xs text-slate-500">
                              📍 {driver.microLocation}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="whitespace-nowrap rounded-full border border-green-200/20 bg-green-600/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                              {driver.status}
                            </span>

                            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                              {driver.impact} Impact
                            </span>
                          </div>

                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {driver.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">
                          <span>Source: {driver.source}</span>
                          <span>Checked: {driver.lastChecked}</span>
                        </div>

                      </div>
                    ))}

                  </div>

                </article>
              );
            })}

          </div>

        </section>
      )}

      {/* PROJECT ACTIVITY */}
      {microLocations.some((location) => location.projects.length > 0) && (
        <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

          <div className="rounded-3xl border border-slate-200 bg-white/80 p-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
              Project Activity
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Upcoming & Active Projects
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Project activity is shown as an investment signal. Status and
              source information are included so users can understand why
              development activity is being highlighted.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">

              {microLocations
                .flatMap((location) =>
                  location.projects.map((project) => ({
                    ...project,
                    microLocation: location.name,
                  }))
                )
                .map((project) => (
                  <div
                    key={`${project.microLocation}-${project.name}`}
                    className="rounded-2xl border border-slate-200 bg-green-50 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-xs text-slate-500">
                          📍 {project.microLocation}
                        </p>

                        <h3 className="mt-1 text-base font-semibold text-slate-900">
                          {project.name}
                        </h3>
                      </div>

                      <span className="whitespace-nowrap rounded-full border border-green-200/20 bg-green-600/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                        {project.status}
                      </span>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
                      <span>📍 {project.location}</span>
                      <span>Source: {project.source}</span>
                      <span>Checked: {project.lastChecked}</span>
                    </div>

                  </div>
                ))}

            </div>

          </div>

        </section>
      )}

      {/* OUTLOOK */}
      <section className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">

        <div className="rounded-3xl border border-green-200/20 bg-white/80 p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            PropertyHub Outlook
          </p>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
            {area.outlook}
          </p>

          {/* INVESTMENT SCORE */}
          {investmentIntelligence.score !== null && (
            <div className="mt-7 rounded-2xl border border-green-200/20 bg-green-50 p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                    Investment Score
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-semibold text-slate-900">
                      {investmentIntelligence.score}
                    </span>

                    <span className="pb-1 text-sm text-slate-500">
                      / 100
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-green-200/20 bg-green-600/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                      {investmentIntelligence.outlook === "strong"
                        ? "Strong Potential"
                        : investmentIntelligence.outlook === "positive"
                          ? "Positive Opportunity"
                          : "Watch Carefully"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {investmentIntelligence.score >= 80
                        ? "80+ indicates strong investment potential"
                        : investmentIntelligence.score >= 65
                          ? "65–79 indicates a positive but selective opportunity"
                          : investmentIntelligence.score >= 50
                            ? "50–64 indicates an area to monitor carefully"
                            : "Below 50 indicates an early-stage opportunity"}
                    </span>
                  </div>

                  <div className="mt-4 w-full max-w-xl">
                    <div className="h-2 overflow-hidden rounded-full bg-green-50">
                      <div
                        className="h-full rounded-full bg-green-600 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, investmentIntelligence.score)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-1.5 flex justify-between text-[9px] uppercase tracking-wider text-slate-400">
                      <span>0</span>
                      <span>50</span>
                      <span>80</span>
                      <span>100</span>
                    </div>
                  </div>

                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                    Data Coverage
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {investmentIntelligence.microLocationCount} micro-location
                    {investmentIntelligence.microLocationCount === 1 ? "" : "s"}
                  </p>
                </div>

              </div>

              {(investmentIntelligence.strengths.length > 0 ||
                investmentIntelligence.watchouts.length > 0) && (
                <div className="mt-5 border-t border-slate-200 pt-5">

                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                      Investor Takeaway
                    </p>

                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                      The investment score is supported by the strongest verified
                      signals across the tracked micro-locations, with key factors
                      to consider before investing.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-green-200/10 bg-green-600/[0.03] p-4">

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-green-700">
                        What Supports The Investment
                      </p>

                      {investmentIntelligence.strengths.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
                          {investmentIntelligence.strengths.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-green-700">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-xs text-slate-400">
                          No strong positive indicators confirmed yet.
                        </p>
                      )}

                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                      <p className="text-[10px] font-semibold uppercase tracking-wider text-green-700">
                        What To Watch
                      </p>

                      {investmentIntelligence.watchouts.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
                          {investmentIntelligence.watchouts.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-slate-500">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-xs text-slate-400">
                          No major watchouts identified from current data.
                        </p>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* SCORE BREAKDOWN */}
              {investmentIntelligence.signals && (
                <div className="mt-5 border-t border-slate-200 pt-5">

                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green-700">
                      Score Breakdown
                    </p>

                    <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                      The Investment Score combines seven market signals using
                      PropertyHub's defined investment weighting.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {[
                      {
                        label: "Demand",
                        score: investmentIntelligence.signals.demand,
                        weight: "20%",
                      },
                      {
                        label: "Price Momentum",
                        score: investmentIntelligence.signals.priceMomentum,
                        weight: "15%",
                      },
                      {
                        label: "Buyer Activity",
                        score: investmentIntelligence.signals.buyerActivity,
                        weight: "15%",
                      },
                      {
                        label: "Development",
                        score: investmentIntelligence.signals.development,
                        weight: "15%",
                      },
                      {
                        label: "Connectivity",
                        score: investmentIntelligence.signals.connectivity,
                        weight: "10%",
                      },
                      {
                        label: "Future Potential",
                        score: investmentIntelligence.signals.futurePotential,
                        weight: "15%",
                      },
                      {
                        label: "Supply Pressure",
                        score: investmentIntelligence.signals.newSupply,
                        weight: "10%",
                      },
                    ].map((signal) => (
                      <div
                        key={signal.label}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-600">
                              {signal.label}
                            </span>

                            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                              {signal.weight}
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-green-700">
                            {Math.round(signal.score)}/100
                          </span>

                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-green-50">
                          <div
                            className="h-full rounded-full bg-green-600 transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, signal.score)
                              )}%`,
                            }}
                          />
                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )}

            </div>
          )}

          {/* GROWTH RADAR INTELLIGENCE */}
          <div className="mt-7 border-t border-slate-200 pt-6">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                  Growth Radar Intelligence
                </p>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                  PropertyHub separates verified market signals from areas
                  where sufficient data is not yet available.
                </p>
              </div>

              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                {investmentIntelligence.dataStatus.replace("_", " ")}
              </span>

            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-slate-200 bg-green-50 p-4">

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      Data Confidence
                    </p>

                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {investmentIntelligence.confidence > 0
                        ? `${investmentIntelligence.confidence}%`
                        : "—"}
                    </p>
                  </div>

                  {investmentIntelligence.confidence > 0 && (
                    <span className="rounded-full border border-green-200/20 bg-green-600/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                      {investmentIntelligence.confidence >= 80
                        ? "High"
                        : investmentIntelligence.confidence >= 65
                          ? "Moderate"
                          : "Limited"}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                  Based on{" "}
                  {investmentIntelligence.microLocationCount} tracked
                  micro-location
                  {investmentIntelligence.microLocationCount === 1 ? "" : "s"}
                </p>

              </div>

              <div className="rounded-xl border border-green-200/15 bg-green-50 p-4 sm:col-span-2 lg:col-span-2">

                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    AI Outlook
                  </p>

                  <span className="rounded-full border border-green-200/20 bg-green-600/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
                    {investmentIntelligence.outlook === "insufficient_data"
                      ? "Limited Data"
                      : investmentIntelligence.outlook === "strong"
                        ? "Strong"
                        : investmentIntelligence.outlook === "positive"
                          ? "Positive"
                          : "Watch Carefully"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {investmentIntelligence.aiOutlook}
                </p>

              </div>

              <RadarInfo
                title="Market Signals"
                value={
                  investmentIntelligence.signals
                    ? "7 signals active"
                    : "Data collection underway"
                }
              />

              <RadarInfo
                title="Last Updated"
                value={growthArea?.lastUpdated || "—"}
              />

            </div>

            {investmentIntelligence.signals && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <RadarInfo
                  title="Demand"
                  value={`${Math.round(investmentIntelligence.signals.demand)}/100`}
                />

                <RadarInfo
                  title="Price Momentum"
                  value={`${Math.round(investmentIntelligence.signals.priceMomentum)}/100`}
                />

                <RadarInfo
                  title="Buyer Activity"
                  value={`${Math.round(investmentIntelligence.signals.buyerActivity)}/100`}
                />

                <RadarInfo
                  title="Supply Pressure"
                  value={`${Math.round(investmentIntelligence.signals.newSupply)}/100`}
                />

                <RadarInfo
                  title="Development"
                  value={`${Math.round(investmentIntelligence.signals.development)}/100`}
                />

                <RadarInfo
                  title="Connectivity"
                  value={`${Math.round(investmentIntelligence.signals.connectivity)}/100`}
                />

                <RadarInfo
                  title="Future Potential"
                  value={`${Math.round(investmentIntelligence.signals.futurePotential)}/100`}
                />

              </div>
            )}

          </div>

        </div>

      </section>

      {/* PROPERTY CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-white p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
            Explore Property
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Looking for property in {area.name}?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Explore properties listed on PropertyHub in and around this
            investment area.
          </p>

          <Link
            href={`/properties?location=${encodeURIComponent(area.name)}`}
            className="mt-6 inline-flex items-center rounded-xl border border-green-200/30 bg-green-600/10 px-5 py-3 text-sm font-semibold text-green-700 transition hover:border-green-200/60 hover:bg-green-600/15"
          >
            View Properties in {area.name}
            <span className="ml-2">↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-green-50 p-3">
      <p className="text-[9px] uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SnapshotCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-green-200/15 bg-white/80 p-5">

      <p className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-lg font-semibold capitalize text-green-700">
          {value}
        </p>

        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          Area View
        </span>
      </div>

    </div>
  );
}

function SignalCard({
  icon,
  title,
  value,
  score,
  explanation,
}: {
  icon: string;
  title: string;
  value: string;
  score: number;
  explanation: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white/80 p-5 transition-all duration-200 hover:border-green-200/25 hover:bg-green-50">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-green-200/10 bg-green-600/10 text-sm">
            {icon}
          </span>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Market Signal
            </p>

            <p className="mt-0.5 text-sm font-medium text-slate-600">
              {title}
            </p>
          </div>
        </div>

        <span className="rounded-full border border-green-200/20 bg-green-600/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-green-700">
          Signal
        </span>

      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">

        <div className="flex items-end justify-between gap-3">

          <p className="text-2xl font-semibold tracking-tight text-green-700">
            {value}
          </p>

          <span className="text-xs font-medium text-slate-500">
            {Math.round(score)}/100
          </span>

        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {explanation}
        </p>

        <p className="mt-3 text-[9px] uppercase tracking-[0.14em] text-slate-400">
          Current area intelligence
        </p>

      </div>

    </div>
  );
}

function RadarInfo({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-green-50 p-4 transition-all duration-200 hover:border-green-200/20 hover:bg-green-50">

      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">

        <p className="text-sm font-semibold capitalize tracking-tight text-slate-900">
          {value}
        </p>

        <span className="h-1.5 w-1.5 rounded-full bg-green-600/70 opacity-70 transition-opacity group-hover:opacity-100" />

      </div>

    </div>
  );
}
