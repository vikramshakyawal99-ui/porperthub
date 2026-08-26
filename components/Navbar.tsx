"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const ownerRoles = [
    "property_owner",
    "hostel_owner",
    "pg_owner",
    "room_owner",
    "resale_seller",
  ];

  function getDashboardLink() {
    if (role === "admin") return "/admin";

    if (role === "property_dealer") {
      return "/dealer/dashboard";
    }

    if (role && ownerRoles.includes(role)) {
      return "/owner/dashboard";
    }

    return "/buyer/dashboard";
  }

  function getListPropertyLink() {
    if (!user) {
      return (
        "/buyer-login?redirect=" +
        encodeURIComponent("/owner/add-property")
      );
    }

    if (role === "property_dealer") {
      return "/dealer/add-property";
    }

    return "/owner/add-property";
  }

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Builders", href: "/builders" },
    { label: "Projects", href: "/properties?purpose=new" },
    { label: "Investment", href: "/investment-areas" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <Image
            src="/branding/propertyhub-logo.svg"
            alt="PropertyHub - Har Property, Bharose Ke Saath."
            width={215}
            height={60}
            priority
            className="h-[52px] w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-slate-600 hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user && (
            <Link
              href={getDashboardLink()}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-green-50 hover:text-green-700"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="group relative">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-green-300"
              >
                <span className="text-green-700">●</span>
                Profile
              </Link>

              <div className="invisible absolute right-0 top-full mt-2 w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link
                  href="/profile"
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700"
                >
                  My Profile
                </Link>

                <Link
                  href={getDashboardLink()}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700"
                >
                  Dashboard
                </Link>

                <Link
                  href="/favorites"
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700"
                >
                  Saved Properties
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/buyer-login"
              className="text-sm font-bold text-slate-700 hover:text-green-700"
            >
              Sign in
            </Link>
          )}

          <Link
            href={getListPropertyLink()}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 hover:bg-green-700"
          >
            List Property
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-900 lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-green-50 hover:text-green-700"
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardLink()}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-green-50 hover:text-green-700"
              >
                Dashboard
              </Link>
            )}

            <Link
              href={getListPropertyLink()}
              onClick={() => setMenuOpen(false)}
              className="mt-3 rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-bold text-white"
            >
              List Property
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
