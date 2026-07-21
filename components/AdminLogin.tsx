"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
