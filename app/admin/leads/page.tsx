"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Lead = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;

  ownerId?: string;
  dealerId?: string;

  buyerId?: string;
  buyerEmail?: string;

  status?: string;
  priority?: string;
  notes?: string;
  followUpDate?: string;

  source?: string;
  createdAt?: any;
};

type UserRecord = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  business?: string;
};

const statusOptions = [
  "New",
  "Contacted",
  "Interested",
  "Follow Up",
  "Site Visit",
  "Site Visit Scheduled",
  "Closed",
  "Rejected",
  "Lost",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assignedFilter, setAssignedFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "leads")),
          getDocs(collection(db, "users")),
        ]);

        const leadData = leadsSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Lead[];

        const userData = usersSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as UserRecord[];

        leadData.sort(
          (a, b) =>
            Number(b.createdAt?.seconds || 0) -
            Number(a.createdAt?.seconds || 0)
        );

        setLeads(leadData);
        setUsers(userData);
      } catch (error) {
        console.error("ADMIN LEADS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const usersById = useMemo(() => {
    const map: Record<string, UserRecord> = {};

    users.forEach((user) => {
      map[user.id] = user;
    });

    return map;
  }, [users]);

  function getAssignedId(lead: Lead) {
    return lead.dealerId || lead.ownerId || "";
  }

  function getAssignedUser(lead: Lead) {
    const id = getAssignedId(lead);

    if (!id) return undefined;

    return usersById[id];
  }

  function getAssignedName(lead: Lead) {
    const user = getAssignedUser(lead);

    if (user?.name) return user.name;
    if (user?.business) return user.business;
    if (user?.email) return user.email;

    return getAssignedId(lead)
      ? "Assigned Account"
      : "Unassigned";
  }

  function getAssignedRole(lead: Lead) {
    const user = getAssignedUser(lead);

    if (user?.role === "admin") {
      return "Admin";
    }

    if (user?.role === "team_member") {
      return "Team Member";
    }

    if (user?.role === "property_dealer") {
      return "Property Dealer";
    }

    if (user?.role === "property_owner") {
      return "Property Owner";
    }

    if (lead.dealerId) {
      return "Dealer";
    }

    if (lead.ownerId) {
      return "Owner / Team";
    }

    return "Unassigned";
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    try {
      await updateDoc(doc(db, "leads", id), {
        status,
      });

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                status,
              }
            : lead
        )
      );
    } catch (error) {
      console.error(error);
      alert("❌ Status update failed");
    }
  }

  async function updateLeadDetails(
    id: string,
    notes: string,
    followUpDate: string
  ) {
    try {
      await updateDoc(doc(db, "leads", id), {
        notes,
        followUpDate,
      });

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id
            ? {
                ...lead,
                notes,
                followUpDate,
              }
            : lead
        )
      );

      alert("✅ Follow-up saved");
    } catch (error) {
      console.error(error);
      alert("❌ Follow-up save failed");
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "leads", id));

      setLeads((prev) =>
        prev.filter((lead) => lead.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("❌ Lead delete failed");
    }
  }

  const assignedPeople = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
      }
    >();

    leads.forEach((lead) => {
      const id = getAssignedId(lead);

      if (!id) return;

      map.set(id, {
        id,
        name: getAssignedName(lead),
      });
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [leads, usersById]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const assignedId = getAssignedId(lead);

      const searchMatch =
        !query ||
        String(lead.name || "")
          .toLowerCase()
          .includes(query) ||
        String(lead.phone || "")
          .toLowerCase()
          .includes(query) ||
        String(lead.email || "")
          .toLowerCase()
          .includes(query) ||
        String(lead.propertyTitle || "")
          .toLowerCase()
          .includes(query) ||
        getAssignedName(lead)
          .toLowerCase()
          .includes(query);

      const statusMatch =
        statusFilter === "All" ||
        (lead.status || "New") === statusFilter;

      const assignedMatch =
        assignedFilter === "All" ||
        assignedId === assignedFilter;

      return (
        searchMatch &&
        statusMatch &&
        assignedMatch
      );
    });
  }, [
    leads,
    search,
    statusFilter,
    assignedFilter,
    usersById,
  ]);

  const newCount = leads.filter(
    (lead) =>
      !lead.status ||
      lead.status === "New" ||
      lead.status === "Pending"
  ).length;

  const followUpCount = leads.filter(
    (lead) => Boolean(lead.followUpDate)
  ).length;

  const closedCount = leads.filter(
    (lead) => lead.status === "Closed"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          Loading all leads & enquiries...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1600px] p-5 sm:p-8">

        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
            PropertyHub Admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            All Leads & Enquiries
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor customer enquiries across team members,
            owners and dealers.
          </p>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Enquiries
            </p>
            <p className="mt-2 text-3xl font-black text-slate-950">
              {leads.length}
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              New Leads
            </p>
            <p className="mt-2 text-3xl font-black text-green-700">
              {newCount}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Follow Ups
            </p>
            <p className="mt-2 text-3xl font-black text-amber-600">
              {followUpCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Closed
            </p>
            <p className="mt-2 text-3xl font-black text-green-700">
              {closedCount}
            </p>
          </div>

        </section>

        <section className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-3">

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, phone, property or assigned person..."
            className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none transition focus:border-green-500"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none"
          >
            <option value="All">
              All Status
            </option>

            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          <select
            value={assignedFilter}
            onChange={(event) =>
              setAssignedFilter(event.target.value)
            }
            className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none"
          >
            <option value="All">
              All Assigned Accounts
            </option>

            {assignedPeople.map((person) => (
              <option
                key={person.id}
                value={person.id}
              >
                {person.name}
              </option>
            ))}
          </select>

        </section>

        {filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            No matching leads found.
          </div>
        ) : (
          <div className="space-y-4">

            {filteredLeads.map((lead) => {
              const assignedUser =
                getAssignedUser(lead);

              return (
                <article
                  key={lead.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="grid gap-6 xl:grid-cols-[1.1fr_1.2fr_1fr_1.4fr_auto]">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Customer
                      </p>

                      <h2 className="mt-2 text-lg font-black text-slate-950">
                        {lead.name || "Customer"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        📞 {lead.phone || "No phone"}
                      </p>

                      {lead.email && (
                        <p className="mt-1 break-all text-sm text-slate-500">
                          ✉️ {lead.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Property
                      </p>

                      <p className="mt-2 font-bold text-slate-900">
                        {lead.propertyTitle || "Property"}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Lead ID: {lead.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Assigned To
                      </p>

                      <p className="mt-2 font-black text-green-700">
                        {getAssignedName(lead)}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {getAssignedRole(lead)}
                      </p>

                      {assignedUser?.email && (
                        <p className="mt-1 break-all text-xs text-slate-400">
                          {assignedUser.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Follow-up
                      </p>

                      <input
                        id={`notes-${lead.id}`}
                        defaultValue={lead.notes || ""}
                        placeholder="Admin notes..."
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                      />

                      <input
                        id={`date-${lead.id}`}
                        type="date"
                        defaultValue={
                          lead.followUpDate || ""
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                      />

                      <button
                        onClick={() => {
                          const notesElement =
                            document.getElementById(
                              `notes-${lead.id}`
                            ) as HTMLInputElement | null;

                          const dateElement =
                            document.getElementById(
                              `date-${lead.id}`
                            ) as HTMLInputElement | null;

                          updateLeadDetails(
                            lead.id,
                            notesElement?.value || "",
                            dateElement?.value || ""
                          );
                        }}
                        className="mt-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        Save Follow-up
                      </button>
                    </div>

                    <div className="flex min-w-[180px] flex-col gap-2">

                      <select
                        value={lead.status || "New"}
                        onChange={(event) =>
                          updateStatus(
                            lead.id,
                            event.target.value
                          )
                        }
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
                      >
                        {statusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          📞 Call Customer
                        </a>
                      )}

                      <button
                        onClick={() =>
                          deleteLead(lead.id)
                        }
                        className="min-h-11 rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

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
