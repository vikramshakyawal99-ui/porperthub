"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", href: "/admin" },
  { name: "Add Property", href: "/admin/add-property" },
  { name: "Manage Properties", href: "/admin/properties" },
  { name: "Builders", href: "/admin/builders" },
  { name: "Enquiries", href: "/admin/enquiries" },
  { name: "Site Visits", href: "/admin/site-visits" },
  { name: "Leads", href: "/admin/leads" },
  { name: "Loan Applications", href: "/admin/loan-applications" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-10">
        PropertyHub
      </h1>

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 transition ${
              pathname === item.href
                ? "bg-[#60A5FA]"
                : "hover:bg-slate-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
