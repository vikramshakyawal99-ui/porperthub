"use client";

import Link from "next/link";
import { featuredInvestmentArea } from "@/data/investmentAreas";

export default function InvestSmarter() {
  const area = featuredInvestmentArea;

  return (
    <div className="w-full max-w-[520px] rounded-3xl border border-green-100 bg-white/95 backdrop-blur-2xl p-6 shadow-xl shadow-green-900/10">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-green-700">
            Invest Smarter
          </p>

          <h2 className="mt-2 text-2xl font-serif font-semibold leading-tight text-slate-900">
            Where is Jaipur
            <br />
            growing next?
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border-green-200 bg-green-50">
          <span className="text-lg">📈</span>
        </div>
      </div>

      {/* AREA */}
      <div className="mt-6 rounded-2xl border-green-100 bg-green-50/60 p-4">

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-sm">📍</span>
          <span>Featured Growth Area</span>
        </div>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              {area.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {area.city}
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-green-700">
              {area.score}
              <span className="text-sm font-medium text-slate-500">
                /10
              </span>
            </p>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Growth Potential
            </p>
          </div>
        </div>

        {/* SIGNALS */}
        <div className="mt-4 grid grid-cols-3 gap-2">

          <div className="rounded-xl bg-green-50 p-3">
            <span className="text-sm">📈</span>
            <p className="mt-2 text-[11px] text-slate-500">
              Demand
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-900">
              {area.demand}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-3">
            <span className="text-sm">🏗️</span>
            <p className="mt-2 text-[11px] text-slate-500">
              Development
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-900">
              {area.development}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-3">
            <span className="text-sm">📍</span>
            <p className="mt-2 text-[11px] text-slate-500">
              Connectivity
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-900">
              {area.connectivity}
            </p>
          </div>

        </div>
      </div>

      {/* OUTLOOK */}
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-green-700">
          PropertyHub Outlook
        </p>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {area.outlook}
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/investment-areas"
        className="mt-5 flex w-full items-center justify-between rounded-xl border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-all hover:border-green-300 hover:bg-green-100"
      >
        <span>Explore Investment Areas</span>
        <span className="text-base">↗</span>
      </Link>

    </div>
  );
}
