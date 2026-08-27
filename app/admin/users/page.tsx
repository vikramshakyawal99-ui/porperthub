"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type UserRecord = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
  createdAt?: any;
};

const roles = [
  "buyer",
  "property_owner",
  "hostel_owner",
  "pg_owner",
  "room_owner",
  "resale_seller",
  "property_dealer",
  "team_member",
  "admin",
];

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") || "";

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);

      const snap = await getDocs(
        collection(db, "users")
      );

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<UserRecord, "id">),
      }));

      setUsers(data);
    } catch (error) {
      console.error(
        "ADMIN USERS LOAD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(
    id: string,
    role: string
  ) {
    if (
      !confirm(
        `Change this account role to ${role}?`
      )
    ) {
      return;
    }

    try {
      await updateDoc(
        doc(db, "users", id),
        {
          role,
          updatedAt: new Date(),
        }
      );

      setUsers((current) =>
        current.map((user) =>
          user.id === id
            ? {
                ...user,
                role,
              }
            : user
        )
      );

      alert("✅ Role updated");
    } catch (error) {
      console.error(
        "ROLE UPDATE ERROR:",
        error
      );

      alert("Unable to update role.");
    }
  }

  async function toggleActive(
    user: UserRecord
  ) {
    const nextActive =
      user.active === false;

    try {
      await updateDoc(
        doc(db, "users", user.id),
        {
          active: nextActive,
          updatedAt: new Date(),
        }
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                active: nextActive,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "ACTIVE UPDATE ERROR:",
        error
      );

      alert(
        "Unable to update account status."
      );
    }
  }

  const filteredUsers =
    users.filter((user) => {
      if (
        roleFilter &&
        user.role !== roleFilter
      ) {
        return false;
      }

      const text = [
        user.name || "",
        user.email || "",
        user.role || "",
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-wrap items-end justify-between gap-4">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
              PropertyHub Admin
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {roleFilter === "team_member"
                ? "Team Members"
                : "Users & Team"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {roleFilter === "team_member"
                ? "Manage PropertyHub team member access."
                : "Manage buyer, owner, dealer and team access."}
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
            {filteredUsers.length} Accounts
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
            placeholder="Search name, email or role..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-green-500 focus:bg-white"
          />

        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center font-bold text-slate-500">
            Loading accounts...
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <p className="text-lg font-black text-slate-950">
                      {user.name || "Unnamed User"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {user.email || "No email"}
                    </p>

                    <p className="mt-2 break-all text-xs text-slate-400">
                      UID: {user.id}
                    </p>

                    <span
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                        user.active === false
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {user.active === false
                        ? "INACTIVE"
                        : "ACTIVE"}
                    </span>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                    <select
                      value={user.role || "buyer"}
                      onChange={(event) =>
                        changeRole(
                          user.id,
                          event.target.value
                        )
                      }
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                    >
                      {roles.map((role) => (
                        <option
                          key={role}
                          value={role}
                        >
                          {role}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(user)
                      }
                      className={`rounded-xl px-4 py-3 text-sm font-black ${
                        user.active === false
                          ? "bg-green-600 text-white"
                          : "border border-red-200 bg-white text-red-600"
                      }`}
                    >
                      {user.active === false
                        ? "Activate"
                        : "Deactivate"}
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}
