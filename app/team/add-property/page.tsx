"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function TeamAddPropertyTestPage() {
  const { user, role } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-green-100 bg-white p-8 shadow-sm">

        <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
          PropertyHub Team
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Add Property
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Team property form route is working.
        </p>

        <div className="mt-6 rounded-2xl bg-green-50 p-5">
          <p className="text-sm font-bold text-slate-700">
            Logged in as:
          </p>

          <p className="mt-1 font-black text-slate-950">
            {user?.email || "No user"}
          </p>

          <p className="mt-2 text-sm font-bold text-green-700">
            Role: {role || "No role"}
          </p>
        </div>

        <Link
          href="/team/dashboard"
          className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white"
        >
          ← Back to Team Dashboard
        </Link>

      </div>
    </main>
  );
}
