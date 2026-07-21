"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-400 bg-zinc-900 rounded-lg p-3 text-white placeholder:text-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
