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
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          PropertyHub
        </Link>

        <div className="flex items-center gap-6 font-semibold">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link href="/properties" className="hover:text-blue-600">
            Buy
          </Link>

          <Link href="/favorites" className="hover:text-blue-600">
            ❤️ Favorites
          </Link>

          <Link href="/compare" className="hover:text-blue-600">
            ⚖️ Compare
          </Link>

          {user ? (
            <>
              <span className="text-sm text-gray-700">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
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
