"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import useProperties from "@/hooks/useProperties";
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboard() {
  const { properties, loading } = useProperties();
  const { user, role } = useAuth();
  const router = useRouter();

  const [leadCount, setLeadCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [pendingLeadCount, setPendingLeadCount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [mostViewedProperty, setMostViewedProperty] = useState("N/A");

  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

  useEffect(() => {

    if (user === null) {
      router.replace("/control-x9p-admin-8472");
      return;
    }

    if (role && role !== "admin") {
      router.replace("/control-x9p-admin-8472");
      return;
    }

    async function loadStats() {

      const leadsSnap = await getDocs(collection(db, "leads"));
      const visitsSnap = await getDocs(collection(db, "siteVisits"));

      const leadData = leadsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const visitData = visitsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const viewsSnap = await getDocs(collection(db, "propertyViews"));

      let totalViews = 0;

      const viewMap: Record<string, number> = {};

      viewsSnap.docs.forEach((doc) => {
        const data:any = doc.data();

        const title = data.propertyTitle || "Unknown";
        const views = Number(data.views || 0);

        totalViews += views;
        viewMap[title] = views;
      });

      setViewCount(totalViews);

      const mostViewed = Object.entries(viewMap).sort(
        (a,b)=>b[1]-a[1]
      );

      if (mostViewed.length > 0) {
        setMostViewedProperty(mostViewed[0][0]);
      }

      setLeadCount(leadData.length);
      setVisitCount(visitData.length);

      const followUps = leadData.filter(
        (lead:any)=> lead.followUpDate
      );

      setFollowUpCount(followUps.length);

      const pendingLeads = leadData.filter(
        (lead:any) => !lead.status || lead.status === "Pending"
      );

      setPendingLeadCount(pendingLeads.length);

      const conversion =
        leadData.length > 0
          ? Math.round((visitData.length / leadData.length) * 100)
          : 0;

      setConversionRate(conversion);

      const sortedLeads = [...leadData].sort(
        (a:any,b:any) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      const sortedVisits = [...visitData].sort(
        (a:any,b:any) =>
          (b.createdAt?.seconds || 0) -
          (a.createdAt?.seconds || 0)
      );

      setRecentLeads(sortedLeads.slice(0,5));
      setRecentVisits(sortedVisits.slice(0,5));
    }

    loadStats();
  }, [user, role, router]);

  async function handleDelete(id: string) {
    const ok = confirm("Delete this property?");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "properties", id));
      alert("✅ Property deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete property");
    }
  }

  return (
  <>

<div className="flex justify-end bg-zinc-950 p-4">
  <button
    onClick={async()=>{
      await signOut(auth);
      window.location.href="/control-x9p-admin-8472";
    }}
    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
  >
    Logout
  </button>
</div>
    <main className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              🏢 Admin Dashboard
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Properties
                </h3>
                <p className="text-3xl font-bold">
                  {properties.length}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Builders
                </h3>
                <p className="text-3xl font-bold">
                  {new Set(properties.map((p:any)=>p.builder)).size}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Locations
                </h3>
                <p className="text-3xl font-bold">
                  {new Set(properties.map((p:any)=>p.location)).size}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Types
                </h3>
                <p className="text-3xl font-bold">
                  {new Set(properties.map((p:any)=>p.propertyType)).size}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Leads
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {leadCount}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Site Visits
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {visitCount}
                </p>
              </div>


              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Follow Ups
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {followUpCount}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Pending Leads
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {pendingLeadCount}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Conversion Rate
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {conversionRate}%
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Property Views
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {viewCount}
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900 p-5 shadow">
                <h3 className="text-gray-400">
                  Most Viewed
                </h3>
                <p className="mt-2 font-bold text-blue-600">
                  {mostViewedProperty}
                </p>
              </div>

            </div>
          </div>

          <Link
            href="/admin/add-property"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Property
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-zinc-900 p-10 text-center shadow">
            Loading...
          </div>
        ) : (
          <div className="mb-8 rounded-2xl bg-zinc-900 p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold">
              🏠 Recent Added Properties
            </h2>
<div className="grid gap-4 md:grid-cols-5">
              {properties.slice(0, 5).map((property) => (
                <div
                  key={property.id}
                  className="rounded-xl border p-3"
                >
                  {property.image && (
                    <Image
                      src={property.image}
                      alt={property.title || "Property"}
                      width={300}
                      height={128}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  )}

                  <h3 className="mt-3 font-bold">
                    {property.title}
                  </h3>

                  <p className="text-sm text-gray-300">
                    {property.location}
                  </p>

                  <p className="font-semibold text-blue-600">
                    {property.price}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/admin/edit-property/${property.id}`}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(property.id)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl bg-zinc-900 p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">👥 Recent Leads</h2>

            {recentLeads.length === 0 ? (
              <p className="text-gray-400">No Leads Found</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead:any) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <h3 className="font-semibold">{lead.name || "No Name"}</h3>
                      <p className="text-sm text-gray-300">{lead.phone}</p>
                    </div>

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm">
                      {lead.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">🚗 Recent Site Visits</h2>

            {recentVisits.length === 0 ? (
              <p className="text-gray-400">No Site Visits Found</p>
            ) : (
              <div className="space-y-3">
                {recentVisits.map((visit:any) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <h3 className="font-semibold">{visit.name || "No Name"}</h3>
                      <p className="text-sm text-gray-300">
                        {visit.date || ""} {visit.time || ""}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
                      {visit.status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  </>
);
}
