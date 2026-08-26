"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function DealerAnalytics() {
  const [stats, setStats] = useState({
    properties: 0,
    leads: 0,
    visits: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

const [topViewed, setTopViewed] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
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

        const propertyIds = new Set(
      propertiesSnap.docs.map((doc) => doc.id)
    );

    const viewsSnap = await getDocs(
      collection(db, "propertyViews")
    );

    const viewedProperties = viewsSnap.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item: any) => propertyIds.has(item.propertyId))
      .sort(
        (a: any, b: any) =>
          (b.views || 0) - (a.views || 0)
      )
      .slice(0, 5);

    setTopViewed(viewedProperties);

    let approved = 0;
        let pending = 0;
        let rejected = 0;

        propertiesSnap.forEach((doc) => {
          const data = doc.data();

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
        console.error("Dealer analytics error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-gray-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Properties",
      value: stats.properties,
      icon: "🏠",
      description: "Properties uploaded by you",
    },
    {
      title: "Total Leads",
      value: stats.leads,
      icon: "📞",
      description: "Leads received",
    },
    {
      title: "Site Visits",
      value: stats.visits,
      icon: "📅",
      description: "Scheduled site visits",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3B82F6]">
          Dealer Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Track your property performance and activity.
        </p>
      </div>

      {/* MAIN STATS */}

      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">
                  {card.title}
                </p>

                <p className="text-4xl font-bold mt-2">
                  {card.value}
                </p>
              </div>

              <div className="text-4xl">
                {card.icon}
              </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* PROPERTY STATUS */}

      <div className="bg-white rounded-2xl shadow p-6 mt-8">

        <h2 className="text-xl font-bold">
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

      {/* PERFORMANCE */}

      <div className="bg-white rounded-2xl shadow p-6 mt-8">

    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">
          Top Viewed Properties
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Your most viewed property listings
        </p>
      </div>

      <span className="text-2xl">
        👁️
      </span>
    </div>

    <div className="mt-6 space-y-4">

      {topViewed.length === 0 ? (

        <div className="border rounded-xl p-5 text-center text-gray-500">
          No property views yet.
        </div>

      ) : (

        topViewed.map((property: any, index: number) => (

          <div
            key={property.id}
            className="flex items-center justify-between border rounded-xl p-4"
          >

            <div className="flex items-center gap-4">

              <div className="w-9 h-9 rounded-full bg-[#F8FAFC] text-[#3B82F6] flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {property.propertyTitle || "Property"}
                </p>

                <p className="text-sm text-gray-500">
                  Property views
                </p>
              </div>

            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-[#3B82F6]">
                {property.views || 0}
              </p>

              <p className="text-xs text-gray-400">
                views
              </p>
            </div>

          </div>

        ))

      )}

    </div>

  </div>

  <div className="bg-white rounded-2xl shadow p-6 mt-8">

        <h2 className="text-xl font-bold">
          Performance Overview
        </h2>

        <div className="mt-6 space-y-5">

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Properties
              </span>

              <span className="font-semibold">
                {stats.properties}
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B82F6] rounded-full"
                style={{
                  width: `${Math.min(
                    stats.properties * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Leads
              </span>

              <span className="font-semibold">
                {stats.leads}
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{
                  width: `${Math.min(
                    stats.leads * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Site Visits
              </span>

              <span className="font-semibold">
                {stats.visits}
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#d4a855] rounded-full"
                style={{
                  width: `${Math.min(
                    stats.visits * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
