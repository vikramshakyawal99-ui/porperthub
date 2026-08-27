import Link from "next/link";

export default function StaffLoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
            PropertyHub Staff
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Staff Login
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Choose your PropertyHub workspace.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            <Link
              href="/control-x9p-admin-8472"
              className="rounded-2xl border border-green-200 bg-green-50 p-6 transition hover:border-green-400 hover:shadow-md"
            >
              <div className="text-2xl">
                🛡️
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-950">
                Admin Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Full PropertyHub control and management access.
              </p>
            </Link>

            <Link
              href="/team-login"
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-green-400 hover:shadow-md"
            >
              <div className="text-2xl">
                👥
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-950">
                Team Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Property enquiries, listings and team workspace.
              </p>
            </Link>

          </div>

          <Link
            href="/"
            className="mt-8 inline-flex text-sm font-black text-green-700"
          >
            ← Back to PropertyHub
          </Link>

        </div>

      </div>
    </main>
  );
}
