import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          PropertyHub
        </Link>


        <div className="flex gap-6 font-semibold">

          <Link
            href="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>


          <Link
            href="/properties"
            className="hover:text-blue-600"
          >
            Buy
          </Link>


          <Link
            href="/favorites"
            className="hover:text-blue-600"
          >
            ❤️ Favorites
          </Link>


          <Link
            href="/compare"
            className="hover:text-blue-600"
          >
            ⚖️ Compare
          </Link>


        </div>

      </div>
    </nav>
  );
}
