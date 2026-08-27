"use client";

import TeamGuard from "@/components/team/TeamGuard";

export default function TeamTestingPage() {
  return (
    <TeamGuard>
      {() => (
        <main className="min-h-screen bg-slate-50 px-5 py-10">
          <div className="mx-auto max-w-5xl">

            <a
              href="/team/dashboard"
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              ← Back to Dashboard
            </a>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
                PropertyHub Team
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                🧪 Testing
              </h1>

              <p className="mt-3 text-slate-500">
                Website and app testing tasks will appear here.
              </p>
            </div>

          </div>
        </main>
      )}
    </TeamGuard>
  );
}
