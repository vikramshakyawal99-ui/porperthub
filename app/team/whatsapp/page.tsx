"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import TeamGuard from "@/components/team/TeamGuard";

function cleanPhone(value: unknown) {
  let phone = String(value || "")
    .replace(/\D/g, "");

  if (phone.length === 10) {
    phone = `91${phone}`;
  }

  return phone;
}

function WhatsAppContent({
  user,
}: {
  user: any;
}) {
  const [leads, setLeads] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const q = query(
          collection(db, "leads"),
          where(
            "ownerId",
            "==",
            user.uid
          )
        );

        const snap = await getDocs(q);

        const data = snap.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

        data.sort((a: any, b: any) => {
          return (
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
          );
        });

        setLeads(data);
      } catch (error) {
        console.error(
          "TEAM WHATSAPP LEADS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [user]);

  const filtered = leads.filter(
    (lead) => {
      const text = [
        lead.name,
        lead.phone,
        lead.propertyTitle,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <a
              href="/team/dashboard"
              className="text-sm font-black text-green-700"
            >
              ← Team Dashboard
            </a>

            <h1 className="mt-4 text-3xl font-black text-slate-950">
              💬 WhatsApp Enquiries
            </h1>

            <p className="mt-2 text-slate-500">
              Open assigned customer enquiries directly in WhatsApp.
            </p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 font-black text-green-700">
            {leads.length} Customers
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search customer, phone or property..."
            className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-green-500"
          />
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-8">
            Loading WhatsApp enquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No customer enquiries found.
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {filtered.map((lead) => {
              const phone =
                cleanPhone(
                  lead.phone
                );

              const message =
                encodeURIComponent(
                  `Hello ${lead.name || "Customer"}, this is PropertyHub regarding your enquiry for ${lead.propertyTitle || "the property"}. How may I help you?`
                );

              return (
                <article
                  key={lead.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-center">

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Customer
                      </p>

                      <h2 className="mt-2 text-lg font-black text-slate-950">
                        {lead.name ||
                          "Customer"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        📞 {lead.phone ||
                          "No phone"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Property
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {lead.propertyTitle ||
                          "Property"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Status:{" "}
                        {lead.status ||
                          "New"}
                      </p>
                    </div>

                    {phone ? (
                      <a
                        href={`https://wa.me/${phone}?text=${message}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-5 font-black text-white transition hover:bg-green-700"
                      >
                        💬 Reply on WhatsApp
                      </a>
                    ) : (
                      <span className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400">
                        No WhatsApp Number
                      </span>
                    )}

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

export default function TeamWhatsAppPage() {
  return (
    <TeamGuard>
      {({ user }) => (
        <WhatsAppContent
          user={user}
        />
      )}
    </TeamGuard>
  );
}
