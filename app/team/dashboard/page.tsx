"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import TeamGuard from "@/components/team/TeamGuard";

function TeamDashboardContent({
  user,
  role,
}: {
  user: any;
  role: string;
}) {
  const [myPropertiesCount, setMyPropertiesCount] =
    useState(0);

  const [siteVisitsCount, setSiteVisitsCount] =
    useState(0);

  const [pendingFollowUpsCount, setPendingFollowUpsCount] =
    useState(0);

  const [todayLeadsCount, setTodayLeadsCount] =
    useState(0);

  useEffect(() => {
    async function loadTeamStats() {
      if (!user?.uid) return;

      try {
        const [
          propertiesSnap,
          visitsSnap,
          leadsSnap,
        ] = await Promise.all([
          getDocs(
            query(
              collection(db, "properties"),
              where("addedByUid", "==", user.uid)
            )
          ),

          getDocs(
            query(
              collection(db, "siteVisits"),
              where("ownerId", "==", user.uid)
            )
          ),

          getDocs(
            query(
              collection(db, "leads"),
              where("ownerId", "==", user.uid)
            )
          ),
        ]);

        setMyPropertiesCount(
          propertiesSnap.size
        );

        setSiteVisitsCount(
          visitsSnap.size
        );

        const now = new Date();

        const today =
          `${now.getFullYear()}-` +
          `${String(now.getMonth() + 1).padStart(2, "0")}-` +
          `${String(now.getDate()).padStart(2, "0")}`;

        let followUps = 0;
        let todayLeads = 0;

        leadsSnap.docs.forEach((item) => {
          const lead: any = item.data();

          if (
            lead.followUpDate &&
            lead.followUpDate <= today &&
            lead.status !== "Closed" &&
            lead.status !== "Lost" &&
            lead.status !== "Rejected"
          ) {
            followUps++;
          }

          const createdAt =
            lead.createdAt?.toDate?.();

          if (createdAt) {
            const createdDate =
              `${createdAt.getFullYear()}-` +
              `${String(createdAt.getMonth() + 1).padStart(2, "0")}-` +
              `${String(createdAt.getDate()).padStart(2, "0")}`;

            if (createdDate === today) {
              todayLeads++;
            }
          }
        });

        setPendingFollowUpsCount(
          followUps
        );

        setTodayLeadsCount(
          todayLeads
        );
      } catch (error) {
        console.error(
          "TEAM DASHBOARD STATS ERROR:",
          error
        );
      }
    }

    loadTeamStats();
  }, [user]);

  const statCards = [
    {
      title: "My Properties",
      icon: "🏠",
      count: myPropertiesCount,
      href: "/team/my-properties",
      description:
        "Properties added by you.",
    },
    {
      title: "Site Visits",
      icon: "📅",
      count: siteVisitsCount,
      href: "/team/site-visits",
      description:
        "Customer property visits.",
    },
    {
      title: "Pending Follow-ups",
      icon: "⏰",
      count: pendingFollowUpsCount,
      href: "/team/enquiries?filter=today",
      description:
        "Due and overdue follow-ups.",
    },
    {
      title: "Today's Leads",
      icon: "🔥",
      count: todayLeadsCount,
      href: "/team/enquiries",
      description:
        "New enquiries received today.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              PropertyHub Team
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Team Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50"
            >
              🏠 Home Page
            </a>

            <button
              type="button"
              onClick={async () => {
                await signOut(auth);
                window.location.href =
                  "/team-login";
              }}
              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-green-700">
            Access Level
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-950">
            {role === "admin"
              ? "Administrator"
              : "Team Member"}
          </h2>
        </div>

        {/* LIVE WORK SUMMARY */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">
              Work Summary
            </h2>

            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              Live
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-green-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl">
                    {card.icon}
                  </span>

                  <span className="text-3xl font-black text-green-700">
                    {card.count}
                  </span>
                </div>

                <p className="mt-4 font-black text-slate-950">
                  {card.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {card.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* EXISTING TEAM ACTIONS */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <a
            href="/team/add-property"
            className="rounded-2xl border border-green-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-xl font-black text-slate-950">
              ➕ Add Property
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Add a PropertyHub listing.
            </p>
          </a>

          <a
            href="/team/loan-leads"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              🏦 Loan Leads
            </p>
          </a>

          <a
            href="/team/enquiries"
            className="rounded-2xl border border-green-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              📞 Property Enquiries
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Manage customer leads, calls and follow-ups.
            </p>
          </a>

          <a
            href="/team/enquiries"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              ☎ Customer Queries
            </p>
          </a>

          <a
            href="/team/support"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              🏢 Builder / Dealer Support
            </p>
          </a>

          <a
            href="/team/whatsapp"
            className="rounded-2xl border border-green-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              💬 WhatsApp Enquiries
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Open customer enquiries and reply directly on WhatsApp.
            </p>
          </a>

          <a
            href="/team/sponsored-ads"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              📢 Sponsored Ads
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Create, edit, activate, pause and delete ads.
            </p>
          </a>

          <a
            href="/team/testing"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-400 hover:shadow-sm"
          >
            <p className="text-lg font-black text-slate-900">
              🧪 Testing
            </p>
          </a>

        </div>

      </div>
    </main>
  );
}

export default function TeamDashboardPage() {
  return (
    <TeamGuard>
      {({ user, role }) => (
        <TeamDashboardContent
          user={user}
          role={role}
        />
      )}
    </TeamGuard>
  );
}
