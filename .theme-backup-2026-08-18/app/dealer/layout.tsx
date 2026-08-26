"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

const menus = [
  { name: "Dashboard", href: "/dealer/dashboard", icon: "🏠" },
  { name: "Add Property", href: "/dealer/add-property", icon: "➕" },
  { name: "My Listings", href: "/dealer/listings", icon: "📋" },
  { name: "Leads", href: "/dealer/leads", icon: "📞" },
  { name: "Site Visits", href: "/dealer/site-visits", icon: "📅" },
  { name: "Analytics", href: "/dealer/analytics", icon: "📊" },
  { name: "Profile", href: "/dealer/profile", icon: "👤" },
];

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/dealer-login");
      return;
    }

    if (role !== "property_dealer") {
      router.replace("/");
    }
  }, [user, role, loading, router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      router.push("/dealer-login");
    } catch (error) {
      console.error("Dealer logout failed:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || role !== "property_dealer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex">

      <aside className="w-64 bg-zinc-950 text-white flex flex-col">

        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold">
            PROPERTYHUB
          </h1>

          <p className="text-sm text-zinc-400 mt-1">
            Dealer Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-[#d4a855] text-black font-semibold"
                  : "hover:bg-zinc-800"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full text-center bg-red-600 hover:bg-red-700 rounded-xl py-3 transition"
          >
            🚪 Logout
          </button>
        </div>

      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  );
}
