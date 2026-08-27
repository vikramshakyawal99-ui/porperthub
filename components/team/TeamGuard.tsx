"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type TeamAccess = {
  user: User;
  role: string;
};

export default function TeamGuard({
  children,
}: {
  children: (
    access: TeamAccess
  ) => React.ReactNode;
}) {
  const [loading, setLoading] =
    useState(true);

  const [access, setAccess] =
    useState<TeamAccess | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          if (!firebaseUser) {
            setAccess(null);
            setLoading(false);
            setError(
              "Team login required."
            );
            return;
          }

          try {
            const snapshot =
              await getDoc(
                doc(
                  db,
                  "users",
                  firebaseUser.uid
                )
              );

            const role =
              snapshot.exists()
                ? String(
                    snapshot.data()
                      .role || ""
                  )
                : "";

            if (
              role !== "team_member" &&
              role !== "admin"
            ) {
              setAccess(null);
              setError(
                "This account does not have team access."
              );
              setLoading(false);
              return;
            }

            setAccess({
              user: firebaseUser,
              role,
            });

            setError("");
            setLoading(false);
          } catch (err) {
            console.error(
              "TEAM ACCESS ERROR:",
              err
            );

            setAccess(null);
            setError(
              "Unable to verify team access."
            );
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-green-100 bg-white px-7 py-5 font-bold text-slate-700 shadow-sm">
          Checking team access...
        </div>
      </main>
    );
  }

  if (!access) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <h1 className="text-2xl font-black text-slate-950">
            Team Access Required
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <a
            href="/team-login"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white"
          >
            Go to Team Login
          </a>

        </div>
      </main>
    );
  }

  return <>{children(access)}</>;
}
