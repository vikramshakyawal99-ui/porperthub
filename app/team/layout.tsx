"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, role, loading } =
    useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/team-login");
      return;
    }

    if (
      role !== "team_member" &&
      role !== "admin"
    ) {
      router.replace("/");
    }
  }, [
    user,
    role,
    loading,
    router,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading team workspace...
      </main>
    );
  }

  if (
    !user ||
    (
      role !== "team_member" &&
      role !== "admin"
    )
  ) {
    return null;
  }

  return <>{children}</>;
}
