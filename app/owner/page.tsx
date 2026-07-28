"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OwnerDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      const allowedRoles = [
        "property_owner",
        "hostel_owner",
        "pg_owner",
        "room_owner",
        "resale_seller",
      ];

      if (!allowedRoles.includes(role || "")) {
        router.replace("/");
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-3">
          🏢 Owner Dashboard
        </h1>

        <p className="text-gray-400 mb-8">
          Welcome {user?.email}
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            href="/owner/add-property"
            className="bg-green-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            ➕
            <br />
            Add Listing
          </Link>

          <Link
            href="/owner/my-properties"
            className="bg-blue-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            🏠
            <br />
            My Properties
          </Link>

          <Link
            href="/owner/my-pg"
            className="bg-purple-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            🛏️
            <br />
            My PG
          </Link>

          <Link
            href="/owner/my-hostels"
            className="bg-orange-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            🏢
            <br />
            My Hostels
          </Link>

          <Link
            href="/owner/my-rooms"
            className="bg-pink-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            🚪
            <br />
            My Rooms
          </Link>

          <Link
            href="/owner/leads"
            className="bg-red-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            📞
            <br />
            Leads
          </Link>

        </div>
      </div>
    </div>
  );
}
