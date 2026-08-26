"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const snap = await getDoc(
        doc(db, "users", credential.user.uid)
      );

      if (!snap.exists() || snap.data().role !== "admin") {
        alert("Only admin can login.");

        await auth.signOut();

        setLoading(false);
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-zinc-900 p-8 shadow">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Admin Login
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#60A5FA] p-3 text-white hover:bg-[#3B82F6]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
