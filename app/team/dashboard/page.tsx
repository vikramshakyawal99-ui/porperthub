"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export default function TeamDashboard() {
  const { user, role } = useAuth();

  async function logout() {
    await signOut(auth);
    window.location.href =
      "/team-login";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              PropertyHub Team
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Team Workspace
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
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

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Team tools and assigned work will
            appear here as the workspace is
            expanded.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <a
            href="/team/add-property"
            className="rounded-2xl border border-green-200 bg-green-50/40 p-5 transition hover:border-green-400 hover:bg-green-50 hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl text-white">
              ＋
            </div>

            <p className="mt-4 text-lg font-black text-slate-900">
              Add Property
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add a PropertyHub listing and send it for admin approval.
            </p>
          </a>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-lg font-black text-slate-900">
              🎨 UI Tasks
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Frontend and design work.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-lg font-black text-slate-900">
              🧪 Testing
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Test pages and report bugs.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-green-300"
          >
            <p className="text-lg font-black text-slate-900">
              🏠 Website
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Open PropertyHub website.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
