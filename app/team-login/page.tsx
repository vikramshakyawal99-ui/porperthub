"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function TeamLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetLoading, setResetLoading] =
    useState(false);

  async function handleForgotPassword() {
    const cleanEmail =
      email.trim().toLowerCase();

    setError("");
    setMessage("");

    if (!cleanEmail) {
      setError(
        "Enter your team email first."
      );
      return;
    }

    try {
      setResetLoading(true);

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setMessage(
        "Password reset link sent. Check your email inbox."
      );
    } catch (resetError: any) {
      console.error(
        "TEAM PASSWORD RESET ERROR:",
        resetError
      );

      const code = String(
        resetError?.code || ""
      );

      if (code === "auth/invalid-email") {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        code === "auth/too-many-requests"
      ) {
        setError(
          "Too many attempts. Please try again later."
        );
      } else {
        setError(
          "Unable to send password reset email."
        );
      }
    } finally {
      setResetLoading(false);
    }
  }

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
        snapshot.data().role !== "team_member"
      ) {
        await signOut(auth);

        setError(
          "This account does not have team access."
        );

        return;
      }

      await credential.user.getIdToken(true);

      window.location.href =
        "/team/dashboard";
    } catch (loginError: any) {
      console.error(
        "TEAM LOGIN ERROR:",
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-green-100 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-9">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-xl font-black text-white">
          PH
        </div>

        <p className="mt-5 text-center text-[11px] font-black uppercase tracking-[0.18em] text-green-700">
          PropertyHub Team
        </p>

        <h1 className="mt-2 text-center text-3xl font-black text-slate-950">
          Team Login
        </h1>

        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Sign in with your authorized
          PropertyHub team account.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-7 space-y-5"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-700">
              Team Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="team@example.com"
              required
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
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
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                required
                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-20 text-base font-semibold outline-none focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-sm font-bold text-green-700 hover:text-green-800 hover:underline disabled:opacity-60"
            >
              {resetLoading
                ? "Sending..."
                : "Forgot Password?"}
            </button>
          </div>

          {message && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-green-600 text-sm font-black text-white shadow-md shadow-green-600/20 hover:bg-green-700 disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : "Login to Team Workspace"}
          </button>
        </form>
      </div>
    </main>
  );
}
