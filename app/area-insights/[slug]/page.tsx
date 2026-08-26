import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    location?: string;
  }>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export default async function AreaInsightsFallback({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const query = await searchParams;

  const areaName =
    query.location?.trim() ||
    titleFromSlug(slug) ||
    "Jaipur Area";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-green-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <Link
            href="/investment-areas"
            className="text-sm font-semibold text-green-700"
          >
            ← Back to Investment Areas
          </Link>

          <p className="mt-9 text-xs font-black uppercase tracking-[0.2em] text-green-700">
            PropertyHub Area Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {areaName}
          </h1>

          <p className="mt-3 text-slate-500">
            📍 Jaipur
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-10 lg:px-8">
        <section className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
            Market Status
          </p>

          <h2 className="mt-3 text-2xl font-black">
            Area insights are being verified
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            PropertyHub is preparing verified
            demand, price-growth, project and
            infrastructure information for this
            exact location.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <InsightPending
            title="Demand क्यों है?"
            text="Buyer activity, employment access and residential demand are being verified."
          />

          <InsightPending
            title="Price क्यों बढ़ रही है?"
            text="Supply, development and price-momentum information is being prepared."
          />

          <InsightPending
            title="Upcoming Projects"
            text="Verified private project information will appear here."
          />

          <InsightPending
            title="Government Schemes"
            text="Official scheme and infrastructure updates are being verified."
          />
        </div>

        <section className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
          <h2 className="text-lg font-black text-slate-900">
            Watchouts
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Verify exact road access, approvals,
            development status and local pricing
            before making a property decision.
          </p>
        </section>

        <Link
          href={`/properties?location=${encodeURIComponent(
            areaName
          )}`}
          className="flex items-center justify-between rounded-2xl bg-green-600 px-6 py-4 font-black text-white transition hover:bg-green-700"
        >
          Explore Properties in {areaName}
          <span>→</span>
        </Link>

        <p className="text-center text-xs leading-5 text-slate-400">
          Unverified market claims are not displayed.
          Information will be updated as verified
          sources become available.
        </p>
      </div>
    </main>
  );
}

function InsightPending({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
        ◷
      </div>

      <h2 className="mt-4 text-xl font-black">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>

      <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-green-700">
        Verification in progress
      </span>
    </article>
  );
}
