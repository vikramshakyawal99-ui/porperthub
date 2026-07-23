"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user } = useAuth();

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-blue-400 transition hover:text-cyan-300"
        >
          🏠 PropertyHub
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-gray-200">

          <Link
            href="/"
            className="transition hover:text-cyan-400"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="transition hover:text-cyan-400"
          >
            Buy
          </Link>

          <Link
            href="/favorites"
            className="transition hover:text-pink-400"
          >
            ❤️ Favorites
          </Link>

          <Link
            href="/compare"
            className="transition hover:text-yellow-400"
          >
            ⚖️ Compare
          </Link>

          {user ? (
            <>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-300">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-2 text-white transition hover:scale-105 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:scale-105 hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-green-600 px-5 py-2 text-white transition hover:scale-105 hover:bg-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
