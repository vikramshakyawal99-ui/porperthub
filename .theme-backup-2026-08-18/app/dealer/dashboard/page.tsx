"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function DealerDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    visits: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const [propertiesSnap, leadsSnap, visitsSnap] =
          await Promise.all([
            getDocs(
              query(
                collection(db, "properties"),
                where("dealerId", "==", user.uid)
              )
            ),

            getDocs(
              query(
                collection(db, "leads"),
                where("dealerId", "==", user.uid)
              )
            ),

            getDocs(
              query(
                collection(db, "siteVisits"),
                where("dealerId", "==", user.uid)
              )
            ),
          ]);

        let approved = 0;
        let pending = 0;
        let rejected = 0;

        propertiesSnap.forEach((item) => {
          const data = item.data();

          if (data.status === "approved") {
            approved++;
          } else if (data.status === "rejected") {
            rejected++;
          } else {
            pending++;
          }
        });

        setStats({
          properties: propertiesSnap.size,
          leads: leadsSnap.size,
          visits: visitsSnap.size,
          approved,
          pending,
          rejected,
        });
      } catch (error) {
        console.error("Dealer dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3B82F6]">
            Dealer Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your PropertyHub business
          </p>
        </div>

        {/* MAIN STATS */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Total Properties
            </p>

            <h2 className="text-4xl font-bold text-[#3B82F6] mt-2">
              {stats.properties}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Your active listings
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Customer Leads
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {stats.leads}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Enquiries received
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">
              Site Visits
            </p>

            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {stats.visits}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Customer appointments
            </p>
          </div>

        </div>

        {/* PROPERTY STATUS */}

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-900">
            Property Status
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-6">

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Approved
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.approved}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Pending
              </p>

              <p className="text-3xl font-bold text-[#d4a855] mt-2">
                {stats.pending}
              </p>
            </div>

            <div className="border rounded-xl p-5">
              <p className="text-gray-500">
                Rejected
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.rejected}
              </p>
            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <Link href="/dealer/add-property">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">🏠</div>
              <h3 className="font-bold text-lg mt-3">
                Add Property
              </h3>
              <p className="text-gray-500 mt-1">
                Create a new listing
              </p>
            </div>
          </Link>

          <Link href="/dealer/listings">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">📋</div>
              <h3 className="font-bold text-lg mt-3">
                My Listings
              </h3>
              <p className="text-gray-500 mt-1">
                Manage your properties
              </p>
            </div>
          </Link>

          <Link href="/dealer/leads">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">📞</div>
              <h3 className="font-bold text-lg mt-3">
                Leads
              </h3>
              <p className="text-gray-500 mt-1">
                Manage customer enquiries
              </p>
            </div>
          </Link>

          <Link href="/dealer/site-visits">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">📅</div>
              <h3 className="font-bold text-lg mt-3">
                Site Visits
              </h3>
              <p className="text-gray-500 mt-1">
                Manage appointments
              </p>
            </div>
          </Link>

          <Link href="/dealer/analytics">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">📊</div>
              <h3 className="font-bold text-lg mt-3">
                Analytics
              </h3>
              <p className="text-gray-500 mt-1">
                View business performance
              </p>
            </div>
          </Link>

          <Link href="/dealer/profile">
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl">👤</div>
              <h3 className="font-bold text-lg mt-3">
                Profile
              </h3>
              <p className="text-gray-500 mt-1">
                Manage dealer information
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}
