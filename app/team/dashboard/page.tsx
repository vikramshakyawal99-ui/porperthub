"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import TeamGuard from "@/components/team/TeamGuard";

export default function TeamDashboardPage() {
  return (
    <TeamGuard>
      {({ user, role }) => (
        <main className="min-h-screen bg-slate-50 px-5 py-10">
          <div className="mx-auto max-w-6xl">

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
                  PropertyHub Team
                </p>

                <h1 className="mt-2 text-3xl font-black text-slate-950">
                  Team Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  {user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await signOut(auth);
                  window.location.href = "/team-login";
                }}
                className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600"
              >
                Logout
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-black text-green-700">
                Access Level
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-950">
                {role === "admin"
                  ? "Administrator"
                  : "Team Member"}
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <a
                href="/team/add-property"
                className="rounded-2xl border border-green-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-xl font-black text-slate-950">
                  ➕ Add Property
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Add a PropertyHub listing.
                </p>
              </a>

              <a
                href="/team/loan-leads"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  🏦 Loan Leads
                </p>
              </a>

              <a
                href="/team/enquiries"
                className="rounded-2xl border border-green-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  📞 Property Enquiries
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Manage customer leads, calls and follow-ups.
                </p>
              </a>

              <a
                href="/team/enquiries"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  ☎ Customer Queries
                </p>
              </a>

              <a
                href="/team/support"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  🏢 Builder / Dealer Support
                </p>
              </a>

              <a
                href="/team/sponsored-ads"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  📢 Sponsored Ads
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Create, edit, activate, pause and delete ads.
                </p>
              </a>

              <a
                href="/team/testing"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
              >
                <p className="text-lg font-black text-slate-900">
                  🧪 Testing
                </p>
              </a>

            </div>
          </div>
        </main>
      )}
    </TeamGuard>
  );
}
