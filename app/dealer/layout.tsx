"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { name: "Dashboard", href: "/dealer/dashboard", icon: "🏠" },
  { name: "Add Property", href: "/dealer/add-property", icon: "➕" },
  { name: "My Listings", href: "/dealer/listings", icon: "📋" },
  { name: "Leads", href: "/dealer/leads", icon: "📞" },
  { name: "Site Visits", href: "/dealer/site-visits", icon: "📅" },
  { name: "Analytics", href: "/dealer/analytics", icon: "📊" },
  { name: "Profile", href: "/dealer/profile", icon: "👤" },
  { name: "Subscription", href: "/dealer/subscription", icon: "💎" },
  { name: "Settings", href: "/dealer/settings", icon: "⚙️" },
];

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-zinc-100">

      <aside className="w-72 bg-zinc-900 text-white flex flex-col">

        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-yellow-400">
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
                  ? "bg-yellow-500 text-black font-semibold"
                  : "hover:bg-zinc-800"
              }`}
            >
              {item.icon} {item.name}
            </Link>

          ))}

        </nav>

        <div className="p-4 border-t border-zinc-800">

          <Link
            href="/"
            className="block text-center bg-red-600 hover:bg-red-700 rounded-xl py-3"
          >
            🚪 Logout
          </Link>

        </div>

      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  );
}
