"use client";

import { useEffect } from "react";

export default function SignupPage() {
  useEffect(() => {
    window.location.replace(
      "/buyer-login?signup=true"
    );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7FBF8]">
      <div className="rounded-2xl border border-[#D8EBDD] bg-white px-8 py-6 font-bold text-[#102A1A] shadow-lg">
        Opening PropertyHub account setup...
      </div>
    </main>
  );
}
