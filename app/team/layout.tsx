"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type DebugInfo = {
  status: string;
  email: string;
  uid: string;
  firestoreRole: string;
  userDocExists: string;
  error: string;
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [debug, setDebug] = useState<DebugInfo>({
    status: "Starting...",
    email: "",
    uid: "",
    firestoreRole: "",
    userDocExists: "",
    error: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        console.log("===== TEAM DEBUG =====");
        console.log("Firebase user:", firebaseUser);

        if (!firebaseUser) {
          setDebug({
            status: "NOT LOGGED IN",
            email: "",
            uid: "",
            firestoreRole: "",
            userDocExists: "NO",
            error: "",
          });

          setAllowed(false);
          setChecking(false);
          return;
        }

        try {
          console.log(
            "TEAM EMAIL:",
            firebaseUser.email
          );

          console.log(
            "TEAM UID:",
            firebaseUser.uid
          );

          const ref = doc(
            db,
            "users",
            firebaseUser.uid
          );

          const snap = await getDoc(ref);

          console.log(
            "USER DOC EXISTS:",
            snap.exists()
          );

          console.log(
            "USER DATA:",
            snap.exists()
              ? snap.data()
              : null
          );

          const firestoreRole =
            snap.exists()
              ? String(
                  snap.data()?.role || ""
                )
              : "";

          const isAllowed =
            firestoreRole === "team_member" ||
            firestoreRole === "admin";

          console.log(
            "FIRESTORE ROLE:",
            firestoreRole
          );

          console.log(
            "TEAM ACCESS:",
            isAllowed
          );

          setDebug({
            status: isAllowed
              ? "ACCESS GRANTED"
              : "ACCESS DENIED",
            email:
              firebaseUser.email || "",
            uid: firebaseUser.uid,
            firestoreRole:
              firestoreRole || "NO ROLE",
            userDocExists:
              snap.exists() ? "YES" : "NO",
            error: "",
          });

          setAllowed(isAllowed);
          setChecking(false);
        } catch (error: any) {
          console.error(
            "TEAM DEBUG ERROR:",
            error
          );

          setDebug({
            status: "FIRESTORE ERROR",
            email:
              firebaseUser.email || "",
            uid: firebaseUser.uid,
            firestoreRole: "",
            userDocExists: "UNKNOWN",
            error:
              error?.message ||
              String(error),
          });

          setAllowed(false);
          setChecking(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-black">
            Checking Team Access...
          </h1>
        </div>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

          <p className="text-sm font-black uppercase tracking-widest text-red-600">
            PropertyHub Team Debug
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Team Access Blocked
          </h1>

          <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-6">

            <p>
              <b>Status:</b>{" "}
              {debug.status}
            </p>

            <p>
              <b>Email:</b>{" "}
              {debug.email || "NONE"}
            </p>

            <p className="break-all">
              <b>UID:</b>{" "}
              {debug.uid || "NONE"}
            </p>

            <p>
              <b>User document:</b>{" "}
              {debug.userDocExists}
            </p>

            <p>
              <b>Firestore role:</b>{" "}
              {debug.firestoreRole || "NONE"}
            </p>

            {debug.error && (
              <p className="break-all text-red-600">
                <b>Error:</b>{" "}
                {debug.error}
              </p>
            )}

          </div>

          <p className="mt-6 text-sm text-slate-500">
            This diagnostic page intentionally does not redirect anywhere.
          </p>

        </div>
      </main>
    );
  }

  return <>{children}</>;
}
