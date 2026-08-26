import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-green-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-green-700"
        >
          PropertyHub
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 transition hover:text-green-700"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-semibold text-slate-700 transition hover:text-green-700"
          >
            Buy
          </Link>

          <Link
            href="/properties?purpose=rent"
            className="text-sm font-semibold text-slate-700 transition hover:text-green-700"
          >
            Rent
          </Link>

          <Link
            href="/investment-areas"
            className="text-sm font-semibold text-slate-700 transition hover:text-green-700"
          >
            Investment
          </Link>

          <Link
            href="/owner/add-property"
            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
          >
            List Property
          </Link>
        </div>

        <Link
          href="/properties"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 md:hidden"
        >
          Search
        </Link>

      </div>
    </nav>
  );
}
