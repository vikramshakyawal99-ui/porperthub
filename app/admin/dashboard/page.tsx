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
  const [loanApplicationCount, setLoanApplicationCount] = useState(0);
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
      const loanApplicationsSnap = await getDocs(
        collection(db, "loanApplications")
      );

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
      setLoanApplicationCount(loanApplicationsSnap.size);

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
    <div className="flex items-center justify-between border-b border-green-100 bg-white px-5 py-4 sm:px-8">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 text-sm font-black text-green-800 transition hover:border-green-400 hover:bg-green-100"
      >
        <span>🏠</span>
        Homepage
      </Link>

      <button
        onClick={async () => {
          await signOut(auth);
          window.location.href = "/control-x9p-admin-8472";
        }}
        className="min-h-11 rounded-xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700"
      >
        Logout
      </button>
    </div>

    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col items-stretch justify-between lg:flex-row lg:items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              🏢 Admin Dashboard
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

              <Link
                href="/admin/properties"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
              >
                <h3 className="text-slate-500">Properties</h3>
                <p className="text-3xl font-bold text-slate-950">
                  {properties.length}
                </p>
              </Link>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Builders</h3>
                <p className="text-3xl font-bold text-slate-950">
                  {new Set(properties.map((p: any) => p.builder)).size}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Locations</h3>
                <p className="text-3xl font-bold text-slate-950">
                  {new Set(properties.map((p: any) => p.location)).size}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Types</h3>
                <p className="text-3xl font-bold text-slate-950">
                  {new Set(properties.map((p: any) => p.propertyType)).size}
                </p>
              </div>

              <Link
                href="/admin/leads"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
              >
                <h3 className="text-slate-500">Leads</h3>
                <p className="text-3xl font-bold text-green-700">
                  {leadCount}
                </p>
              </Link>

              <Link
                href="/admin/site-visits"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
              >
                <h3 className="text-slate-500">Site Visits</h3>
                <p className="text-3xl font-bold text-green-700">
                  {visitCount}
                </p>
              </Link>

              <Link
                href="/admin/loan-applications"
                className="rounded-2xl border border-green-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-[0_12px_30px_rgba(22,163,74,0.10)]"
              >
                <h3 className="text-slate-500">
                  🏦 Home Loans
                </h3>
                <p className="text-3xl font-bold text-green-700">
                  {loanApplicationCount}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Loan Applications
                </p>
              </Link>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Follow Ups</h3>
                <p className="text-3xl font-bold text-green-700">
                  {followUpCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Pending Leads</h3>
                <p className="text-3xl font-bold text-green-700">
                  {pendingLeadCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Conversion Rate</h3>
                <p className="text-3xl font-bold text-green-700">
                  {conversionRate}%
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Property Views</h3>
                <p className="text-3xl font-bold text-green-700">
                  {viewCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                <h3 className="text-slate-500">Most Viewed</h3>
                <p className="mt-2 font-bold text-green-700">
                  {mostViewedProperty}
                </p>
              </div>

            </div>
          </div>

          <div className="ml-0 mt-5 flex w-full flex-col gap-3 sm:w-auto lg:ml-6 lg:mt-0 lg:min-w-[260px]">
            <Link
              href="/admin/sponsored-ads"
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-center text-sm font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              <span>📢</span>
              Sponsored Advertisements
            </Link>

            <Link
              href="/admin/add-property"
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-green-600 bg-white px-5 text-center text-sm font-black text-green-700 transition hover:-translate-y-0.5 hover:bg-green-50"
            >
              <span>＋</span>
              Add Property
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-green-100 bg-white p-10 text-center text-slate-600 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            Loading properties...
          </div>
        ) : (
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <h2 className="text-xl font-bold text-slate-950">
              Dashboard Overview
            </h2>
            <p className="mt-2 text-slate-500">
              Manage properties, leads and site visits from the dashboard.
            </p>
          </div>
        )}

      </div>
    </main>
  </>
);
}

