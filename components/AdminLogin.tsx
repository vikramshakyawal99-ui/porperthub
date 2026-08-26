"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

      const snapshot = await getDoc(
        doc(
          db,
          "users",
          credential.user.uid
        )
      );

      if (
        !snapshot.exists() ||
        snapshot.data().role !== "admin"
      ) {
        await auth.signOut();

        setError(
          "This account does not have admin access."
        );

        setLoading(false);
        return;
      }

      await credential.user.getIdToken(true);

      window.location.href =
        "/admin/dashboard";
    } catch (loginError: any) {
      console.error(
        "ADMIN LOGIN ERROR:",
        loginError
      );

      const code = String(
        loginError?.code || ""
      );

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError(
          "Email or password is incorrect."
        );
      } else if (
        code === "auth/too-many-requests"
      ) {
        setError(
          "Too many attempts. Please wait and try again."
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[28px] border border-green-100 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-9">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-2xl font-black text-white shadow-lg shadow-green-600/20">
        PH
      </div>

      <p className="mt-5 text-center text-[11px] font-black uppercase tracking-[0.18em] text-green-700">
        PropertyHub Control Panel
      </p>

      <h1 className="mt-2 text-center text-3xl font-black tracking-tight text-slate-950">
        Admin Login
      </h1>

      <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-slate-500">
        Sign in with your authorized
        administrator account.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-7 space-y-5"
      >
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
            Admin Email
          </span>

          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
            Password
          </span>

          <span className="relative block">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-20 text-base font-semibold text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current
                )
              }
              className="absolute inset-y-0 right-3 my-auto h-9 rounded-lg px-3 text-xs font-black text-green-700 hover:bg-green-50"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </span>
        </label>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-green-600 px-5 text-base font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Logging in..."
            : "Login to Admin Panel →"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        Authorized PropertyHub administrators
        only.
      </p>
    </div>
  );
}
